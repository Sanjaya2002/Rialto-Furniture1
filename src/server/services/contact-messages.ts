import "server-only";
import { db } from "../db";
import { notFound } from "../http";

export function createContactMessage(input: {
  name: string;
  email: string;
  phone?: string;
  message: string;
}) {
  return db.contactMessage.create({
    data: { name: input.name, email: input.email, phone: input.phone || null, message: input.message },
    select: { id: true },
  });
}

export function listContactMessages() {
  return db.contactMessage.findMany({ orderBy: { createdAt: "desc" } });
}

async function ensureExists(id: string) {
  const found = await db.contactMessage.findUnique({ where: { id }, select: { id: true } });
  if (!found) throw notFound("Message");
}

export async function updateContactMessageStatus(id: string, status: string) {
  await ensureExists(id);
  return db.contactMessage.update({ where: { id }, data: { status } });
}

export async function deleteContactMessage(id: string) {
  await ensureExists(id);
  await db.contactMessage.delete({ where: { id } });
}
