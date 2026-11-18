/**
 * Manage admin access (Supabase app_metadata.role = "admin").
 *
 *   npm run admin:list                         # list all Supabase users and their role
 *   npm run admin:promote -- you@example.com   # give an existing account admin access
 *   npm run admin:demote  -- you@example.com   # remove admin access
 *
 * Needs NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local.
 */
const { createClient } = require("@supabase/supabase-js");

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env.local");
  process.exit(1);
}

const supabase = createClient(url, key, { auth: { persistSession: false } });
const [command = "list", email] = process.argv.slice(2);

async function allUsers() {
  const users = [];
  for (let page = 1; ; page++) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 200 });
    if (error) throw error;
    users.push(...data.users);
    if (data.users.length < 200) return users;
  }
}

async function main() {
  const users = await allUsers();

  if (command === "list") {
    console.log(`${users.length} user(s):`);
    for (const u of users) {
      const providers = (u.app_metadata?.providers ?? [u.app_metadata?.provider]).join(",");
      const role = u.app_metadata?.role === "admin" ? "ADMIN" : "-";
      console.log(`  ${role.padEnd(6)} ${u.email ?? "(no email)"}  [${providers}]`);
    }
    return;
  }

  if (!email) throw new Error(`Usage: npm run admin:${command} -- someone@example.com`);
  const user = users.find((u) => u.email?.toLowerCase() === email.toLowerCase());
  if (!user) throw new Error(`No Supabase user with email ${email}`);

  const role = command === "promote" ? "admin" : null;
  const { error } = await supabase.auth.admin.updateUserById(user.id, {
    app_metadata: { ...user.app_metadata, role },
  });
  if (error) throw error;
  console.log(`${email}: ${role ? "is now an admin" : "admin access removed"}`);
}

main().catch((error) => {
  console.error(error.message ?? error);
  process.exit(1);
});
