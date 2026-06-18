const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Clean existing data
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.review.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.customOrderRequest.deleteMany();

  // Create Categories
  const executiveChairs = await prisma.category.create({
    data: {
      name: "Executive Chairs",
      slug: "executive-chairs",
      description:
        "Premium executive seating for leadership offices, featuring ergonomic design and luxurious materials.",
      image:
        "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=800&q=80",
    },
  });

  const officeChairs = await prisma.category.create({
    data: {
      name: "Office Chairs",
      slug: "office-chairs",
      description:
        "Comfortable and durable office chairs designed for everyday professional use.",
      image:
        "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=800&q=80",
    },
  });

  const receptionChairs = await prisma.category.create({
    data: {
      name: "Reception Chairs",
      slug: "reception-chairs",
      description:
        "Elegant seating solutions for reception areas, lobbies, and waiting rooms.",
      image:
        "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&q=80",
    },
  });

  const lectureChairs = await prisma.category.create({
    data: {
      name: "Lecture Chairs",
      slug: "lecture-chairs",
      description:
        "Functional and comfortable seating for lecture halls, auditoriums, and educational institutions.",
      image:
        "https://images.unsplash.com/photo-1517502884422-41eaead166d4?w=800&q=80",
    },
  });

  // Executive Chairs Products
  await prisma.product.create({
    data: {
      name: "Rialto Premium Executive Chair",
      slug: "rialto-premium-executive-chair",
      description:
        "Experience unparalleled comfort and sophistication with the Rialto Premium Executive Chair. Crafted with genuine Italian leather, this chair features an adjustable headrest, lumbar support, and a synchronized tilt mechanism. The polished aluminum base and smooth-rolling casters complete the premium package.",
      price: 185000,
      categoryId: executiveChairs.id,
      images: [
        "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=800&q=80",
        "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800&q=80",
        "https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?w=800&q=80",
      ],
      stock: 15,
      featured: true,
      specifications: {
        Material: "Italian genuine leather",
        Frame: "Aluminum alloy with polished finish",
        "Weight Capacity": "150 kg",
        "Seat Dimensions": '50cm (W) x 52cm (D)',
        "Backrest Height": "75cm",
        "Armrests": "3D adjustable with padded surface",
        Warranty: "5 years",
        Color: "Black / Brown",
      },
    },
  });

  await prisma.product.create({
    data: {
      name: "Rialto Elite High-Back Chair",
      slug: "rialto-elite-high-back-chair",
      description:
        "The Rialto Elite High-Back Chair offers supreme comfort for long working hours. Features include memory foam cushioning, breathable mesh back, and intuitive recline controls. Perfect for executives who demand the best.",
      price: 225000,
      categoryId: executiveChairs.id,
      images: [
        "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=800&q=80",
        "https://images.unsplash.com/photo-1567538096630-e0bc55bd6374c?w=800&q=80",
      ],
      stock: 10,
      featured: true,
      specifications: {
        Material: "Premium mesh back with memory foam seat",
        Frame: "Steel with matte black finish",
        "Weight Capacity": "160 kg",
        "Seat Dimensions": '52cm (W) x 54cm (D)',
        "Backrest Height": "80cm",
        "Armrests": "4D adjustable",
        Warranty: "5 years",
        Color: "Black",
      },
    },
  });

  await prisma.product.create({
    data: {
      name: "Rialto Leather Executive Chair",
      slug: "rialto-leather-executive-chair",
      description:
        "A classic leather executive chair that combines traditional craftsmanship with modern ergonomics. Features thick padded cushions, wide armrests, and a sturdy five-star base.",
      price: 155000,
      categoryId: executiveChairs.id,
      images: [
        "https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?w=800&q=80",
        "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&q=80",
      ],
      stock: 20,
      featured: false,
      specifications: {
        Material: "Premium bonded leather",
        Frame: "Steel with chrome finish",
        "Weight Capacity": "140 kg",
        "Seat Dimensions": '48cm (W) x 50cm (D)',
        "Backrest Height": "70cm",
        "Armrests": "Fixed padded",
        Warranty: "3 years",
        Color: "Black / Burgundy",
      },
    },
  });

  // Office Chairs Products
  await prisma.product.create({
    data: {
      name: "Rialto Ergonomic Office Chair",
      slug: "rialto-ergonomic-office-chair",
      description:
        "Designed for all-day comfort, the Rialto Ergonomic Office Chair features adjustable lumbar support, breathable mesh back, and waterfall seat edge to reduce leg fatigue. Ideal for professional work environments.",
      price: 95000,
      categoryId: officeChairs.id,
      images: [
        "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&q=80",
        "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=800&q=80",
      ],
      stock: 35,
      featured: true,
      specifications: {
        Material: "Mesh back with foam seat cushion",
        Frame: "Nylon with reinforced base",
        "Weight Capacity": "130 kg",
        "Seat Dimensions": '48cm (W) x 48cm (D)',
        "Backrest Height": "60cm",
        "Armrests": "Height adjustable",
        Warranty: "3 years",
        Color: "Black / Gray",
      },
    },
  });

  await prisma.product.create({
    data: {
      name: "Rialto Mesh Task Chair",
      slug: "rialto-mesh-task-chair",
      description:
        "A lightweight and breathable task chair perfect for busy office environments. The mesh back promotes air circulation while the synchronized tilt mechanism supports natural movement.",
      price: 75000,
      categoryId: officeChairs.id,
      images: [
        "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=800&q=80",
        "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=800&q=80",
      ],
      stock: 50,
      featured: false,
      specifications: {
        Material: "Full mesh back with fabric seat",
        Frame: "Nylon base",
        "Weight Capacity": "120 kg",
        "Seat Dimensions": '46cm (W) x 46cm (D)',
        "Backrest Height": "55cm",
        "Armrests": "Fixed",
        Warranty: "2 years",
        Color: "Black",
      },
    },
  });

  await prisma.product.create({
    data: {
      name: "Rialto Visitor Chair",
      slug: "rialto-visitor-chair",
      description:
        "Elegant and comfortable seating for office visitors and meeting rooms. Features a sleek design with padded seat and back, chrome base, and compact footprint.",
      price: 45000,
      categoryId: officeChairs.id,
      images: [
        "https://images.unsplash.com/photo-1567538096630-e0bc55bd6374c?w=800&q=80",
        "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&q=80",
      ],
      stock: 40,
      featured: false,
      specifications: {
        Material: "Fabric upholstery",
        Frame: "Chrome-plated steel",
        "Weight Capacity": "120 kg",
        "Seat Dimensions": '44cm (W) x 42cm (D)',
        "Backrest Height": "40cm",
        "Armrests": "None",
        Warranty: "2 years",
        Color: "Black / Blue / Red",
      },
    },
  });

  // Reception Chairs Products
  await prisma.product.create({
    data: {
      name: "Rialto Lobby Lounge Chair",
      slug: "rialto-lobby-lounge-chair",
      description:
        "Make a lasting impression with the Rialto Lobby Lounge Chair. Its contemporary design and plush cushioning create an inviting atmosphere for any reception area.",
      price: 85000,
      categoryId: receptionChairs.id,
      images: [
        "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&q=80",
        "https://images.unsplash.com/photo-1567538096630-e0bc55bd6374c?w=800&q=80",
      ],
      stock: 25,
      featured: true,
      specifications: {
        Material: "Premium fabric upholstery",
        Frame: "Solid wood with steel reinforcement",
        "Weight Capacity": "130 kg",
        "Seat Dimensions": '50cm (W) x 48cm (D)',
        "Overall Height": "85cm",
        "Seat Height": "45cm",
        Warranty: "3 years",
        Color: "Gray / Beige / Navy",
      },
    },
  });

  await prisma.product.create({
    data: {
      name: "Rialto Reception Bench Seat",
      slug: "rialto-reception-bench-seat",
      description:
        "A stylish and practical 3-seater bench perfect for reception areas. The sleek design maximizes seating capacity while maintaining an elegant appearance.",
      price: 145000,
      categoryId: receptionChairs.id,
      images: [
        "https://images.unsplash.com/photo-1517502884422-41eaead166d4?w=800&q=80",
        "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&q=80",
      ],
      stock: 12,
      featured: false,
      specifications: {
        Material: "Premium fabric with foam cushioning",
        Frame: "Steel with powder-coated finish",
        "Weight Capacity": "300 kg (total)",
        Dimensions: '180cm (W) x 65cm (D) x 85cm (H)',
        "Seat Height": "45cm",
        Warranty: "3 years",
        Color: "Gray / Beige",
      },
    },
  });

  await prisma.product.create({
    data: {
      name: "Rialto Waiting Room Chair Set",
      slug: "rialto-waiting-room-chair-set",
      description:
        "A set of 4 stackable waiting room chairs designed for high-traffic reception areas. Easy to clean, durable, and comfortable for extended waiting periods.",
      price: 120000,
      categoryId: receptionChairs.id,
      images: [
        "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&q=80",
        "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=800&q=80",
      ],
      stock: 20,
      featured: false,
      specifications: {
        Material: "Polypropylene shell with steel legs",
        "Weight Capacity": "120 kg per chair",
        "Seat Dimensions": '45cm (W) x 42cm (D)',
        "Stackable": "Yes, up to 6 chairs",
        Warranty: "2 years",
        Color: "Black / White / Red",
        "Includes": "Set of 4 chairs",
      },
    },
  });

  // Lecture Chairs Products
  await prisma.product.create({
    data: {
      name: "Rialto Lecture Hall Chair",
      slug: "rialto-lecture-hall-chair",
      description:
        "Designed for educational institutions, the Rialto Lecture Hall Chair combines comfort with durability. Features a foldable writing tablet, book rack, and ergonomic seat design for extended learning sessions.",
      price: 35000,
      categoryId: lectureChairs.id,
      images: [
        "https://images.unsplash.com/photo-1517502884422-41eaead166d4?w=800&q=80",
        "https://images.unsplash.com/photo-1567538096630-e0bc55bd6374c?w=800&q=80",
      ],
      stock: 200,
      featured: true,
      specifications: {
        Material: "Polypropylene seat and back with steel frame",
        "Writing Tablet": "Foldable, right-handed",
        "Book Rack": "Under-seat wire rack",
        "Weight Capacity": "130 kg",
        "Seat Dimensions": '44cm (W) x 42cm (D)',
        "Seat Height": "44cm",
        Warranty: "3 years",
        Color: "Blue / Gray / Red",
      },
    },
  });

  await prisma.product.create({
    data: {
      name: "Rialto Auditorium Chair",
      slug: "rialto-auditorium-chair",
      description:
        "Premium auditorium seating with plush cushioning and foldable technology. Available in continuous row configurations for theaters and large lecture halls.",
      price: 55000,
      categoryId: lectureChairs.id,
      images: [
        "https://images.unsplash.com/photo-1517502884422-41eaead166d4?w=800&q=80",
        "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&q=80",
      ],
      stock: 150,
      featured: false,
      specifications: {
        Material: "Foam cushion with fabric upholstery",
        Frame: "Steel with powder-coated finish",
        "Weight Capacity": "140 kg",
        "Seat Dimensions": '48cm (W) x 44cm (D)',
        "Seat Height": "45cm",
        Features: "Foldable seat, cup holder",
        Warranty: "5 years",
        Color: "Red / Blue / Gray",
      },
    },
  });

  await prisma.product.create({
    data: {
      name: "Rialto Student Desk Chair Combo",
      slug: "rialto-student-desk-chair-combo",
      description:
        "A practical and durable desk-chair combination designed for classrooms and training rooms. Features a spacious desktop, storage compartment, and ergonomic seating.",
      price: 65000,
      categoryId: lectureChairs.id,
      images: [
        "https://images.unsplash.com/photo-1517502884422-41eaead166d4?w=800&q=80",
        "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&q=80",
      ],
      stock: 100,
      featured: false,
      specifications: {
        Material: "MDF desktop with steel frame, polypropylene seat",
        "Desktop Dimensions": '60cm (W) x 40cm (D)',
        "Storage": "Under-desk storage compartment",
        "Weight Capacity": "120 kg",
        "Seat Height": "Adjustable 42-48cm",
        Warranty: "3 years",
        Color: "Gray / Blue",
      },
    },
  });

  // Sample Reviews
  await prisma.review.createMany({
    data: [
      {
        productId: (
          await prisma.product.findUnique({ where: { slug: "rialto-premium-executive-chair" } })
        ).id,
        name: "Kamal Perera",
        rating: 5,
        comment:
          "Absolutely outstanding quality. This chair transformed my home office. The leather is premium and the ergonomics are superb.",
      },
      {
        productId: (
          await prisma.product.findUnique({ where: { slug: "rialto-premium-executive-chair" } })
        ).id,
        name: "Samantha Silva",
        rating: 4,
        comment:
          "Very comfortable chair for long work hours. The lumbar support is excellent. Would recommend to any professional.",
      },
      {
        productId: (
          await prisma.product.findUnique({ where: { slug: "rialto-ergonomic-office-chair" } })
        ).id,
        name: "Rajesh Kumar",
        rating: 5,
        comment:
          "Best office chair I have ever owned. Great value for money. My back pain has reduced significantly.",
      },
      {
        productId: (
          await prisma.product.findUnique({ where: { slug: "rialto-lobby-lounge-chair" } })
        ).id,
        name: "Dilani Fernando",
        rating: 5,
        comment:
          "Beautiful chairs that elevated our reception area. Clients always compliment the comfort and style.",
      },
      {
        productId: (
          await prisma.product.findUnique({ where: { slug: "rialto-lecture-hall-chair" } })
        ).id,
        name: "Prof. Amal Wijesinghe",
        rating: 4,
        comment:
          "Ordered 150 chairs for our new lecture hall. Great quality, comfortable for long lectures, and the writing tablet is very practical.",
      },
    ],
  });

  console.log("Database seeded successfully!");
  console.log("Categories: 4");
  console.log("Products: 12");
  console.log("Reviews: 5");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
