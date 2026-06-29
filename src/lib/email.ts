import { SITE_CONFIG } from "./constants";

const EMAIL_FROM = process.env.EMAIL_FROM || "orders@rialtofurniture.com";

export async function sendOrderConfirmation(order: any) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not set - skipping email')
    return
  }
  console.log('Email would be sent for order:', order.id)
}