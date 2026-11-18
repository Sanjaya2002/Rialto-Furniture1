/**
 * Adds the Rialto product lines and their prices to the catalogue WITHOUT deleting anything.
 *
 *   npm run db:catalogue            # dry run: shows what would change
 *   npm run db:catalogue -- --apply # writes the changes
 *   npm run db:catalogue -- --apply --force   # also create products that look like duplicates
 *
 * Rules
 * - Categories are created only if their slug is missing. Existing categories are not modified.
 * - A product whose slug already exists only gets its price updated and is marked featured;
 *   its name, description, images and specifications are left alone.
 * - A missing product is created, unless a similar product already exists (e.g. an "Office Chair"
 *   under another slug). Then it is skipped so nothing is duplicated: rename that product in the
 *   admin (renaming regenerates its slug) or re-run with --force.
 *
 * The slugs below must match SOLUTIONS in src/lib/constants.ts.
 */
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const APPLY = process.argv.includes("--apply");
const FORCE = process.argv.includes("--force");

const CATEGORIES = [
  {
    slug: "office-chairs",
    name: "Office Chairs",
    description: "Comfortable, durable chairs for everyday professional use.",
  },
  {
    slug: "executive-chairs",
    name: "Executive Chairs",
    description: "Premium seating for leadership offices and boardrooms.",
  },
  {
    slug: "reception-chairs",
    name: "Reception Chairs",
    description: "Welcoming seating for reception areas, lobbies and waiting rooms.",
  },
  {
    slug: "lecture-chairs",
    name: "Lecture Chairs",
    description: "Functional seating for lecture halls, classrooms and training rooms.",
  },
];

/** price 0 = shown as "Price on request" on the site. */
const PRODUCTS = [
  {
    slug: "rialto-essential-office-chair",
    name: "Rialto Essential Office Chair",
    category: "office-chairs",
    price: 13599,
    similar: /office\s*chair|essential/i,
    description:
      "Practical comfort for everyday work. The Rialto Essential is our dependable office chair, made for long working days in busy offices.",
  },
  {
    slug: "rialto-premium-executive-chair",
    name: "Rialto Premium Executive Chair",
    category: "executive-chairs",
    price: 17199,
    similar: /executive|premium/i,
    description:
      "Designed for elevated workspaces. The Rialto Premium brings refined comfort and presence to leadership offices and boardrooms.",
  },
  {
    slug: "rialto-classic-reception-chair",
    name: "Rialto Classic Reception Chair",
    category: "reception-chairs",
    price: 12899,
    similar: /reception|classic/i,
    description:
      "A welcoming choice for reception spaces. The Rialto Classic makes every first impression count, in lobbies, waiting areas and front offices.",
  },
  {
    slug: "rialto-lecture-chair",
    name: "Rialto Lecture Chair",
    category: "lecture-chairs",
    price: 0, // TODO(client): price not supplied yet
    similar: /lecture/i,
    description:
      "Functional seating for learning spaces. The Rialto Lecture chair is built for lecture halls, classrooms and training rooms.",
  },
];

const fmt = (n) => (n > 0 ? `Rs. ${n.toLocaleString("en-LK")}` : "price on request");

async function main() {
  console.log(APPLY ? "Applying catalogue changes...\n" : "DRY RUN (add --apply to write)\n");

  const existingProducts = await prisma.product.findMany({
    select: { id: true, slug: true, name: true, price: true },
    orderBy: { name: "asc" },
  });
  console.log(`Current catalogue: ${existingProducts.length} product(s)`);
  for (const p of existingProducts) console.log(`  - ${p.name} [${p.slug}] ${fmt(p.price)}`);
  console.log("");

  const categoryIds = {};
  for (const c of CATEGORIES) {
    const found = await prisma.category.findUnique({ where: { slug: c.slug } });
    if (found) {
      categoryIds[c.slug] = found.id;
      console.log(`= category "${found.name}" exists`);
    } else {
      console.log(`+ create category "${c.name}"`);
      if (APPLY) categoryIds[c.slug] = (await prisma.category.create({ data: c })).id;
    }
  }
  console.log("");

  for (const p of PRODUCTS) {
    const found = existingProducts.find((e) => e.slug === p.slug);
    if (found) {
      const priceChange = p.price > 0 && found.price !== p.price;
      console.log(
        `~ "${found.name}": ${priceChange ? `price ${fmt(found.price)} -> ${fmt(p.price)}, ` : ""}mark featured`,
      );
      if (APPLY) {
        await prisma.product.update({
          where: { slug: p.slug },
          data: { featured: true, ...(priceChange ? { price: p.price } : {}) },
        });
      }
      continue;
    }

    const lookalikes = existingProducts.filter((e) => p.similar.test(e.name));
    if (lookalikes.length > 0 && !FORCE) {
      console.log(
        `! skip "${p.name}": similar product(s) exist: ${lookalikes.map((l) => `"${l.name}" [${l.slug}]`).join(", ")}\n` +
          `    Rename one to "${p.name}" in the admin (its slug becomes ${p.slug}) and re-run, or use --force.`,
      );
      continue;
    }

    console.log(`+ create "${p.name}" ${fmt(p.price)} [${p.slug}]`);
    if (APPLY) {
      const categoryId = categoryIds[p.category];
      if (!categoryId) throw new Error(`Category ${p.category} missing`);
      await prisma.product.create({
        data: {
          name: p.name,
          slug: p.slug,
          description: p.description,
          price: p.price,
          categoryId,
          stock: 0,
          featured: true,
          images: [],
        },
      });
    }
  }

  console.log(APPLY ? "\nDone." : "\nNothing written. Re-run with --apply to make these changes.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
