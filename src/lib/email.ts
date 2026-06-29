//import { Resend } from "resend";
import { formatPrice } from "./utils";
import { SITE_CONFIG } from "./constants";

const resend = new Resend(process.env.RESEND_API_KEY || "re_placeholder");

const EMAIL_FROM = process.env.EMAIL_FROM || "orders@rialtofurniture.com";

interface OrderItemData {
  name: string;
  quantity: number;
  price: number;
}

interface OrderEmailData {
  id: string;
  customerName: string;
  customerEmail: string;
  address: string;
  paymentMethod: string;
  totalAmount: number;
  createdAt: Date;
  items: OrderItemData[];
}

function buildOrderConfirmationHtml(order: OrderEmailData): string {
  const itemsHtml = order.items
    .map(
      (item) => `
    <tr>
      <td style="padding: 12px 8px; border-bottom: 1px solid #e5e7eb; font-size: 14px;">${item.name}</td>
      <td style="padding: 12px 8px; border-bottom: 1px solid #e5e7eb; font-size: 14px; text-align: center;">${item.quantity}</td>
      <td style="padding: 12px 8px; border-bottom: 1px solid #e5e7eb; font-size: 14px; text-align: right;">${formatPrice(item.price)}</td>
      <td style="padding: 12px 8px; border-bottom: 1px solid #e5e7eb; font-size: 14px; text-align: right;">${formatPrice(item.price * item.quantity)}</td>
    </tr>`
    )
    .join("");

  const paymentLabel =
    order.paymentMethod === "cod"
      ? "Cash on Delivery"
      : order.paymentMethod === "payhere"
        ? "PayHere (Card / Online Banking)"
        : "KOKO Payment";

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0; padding:0; background:#f4f4f5; font-family: Georgia, 'Times New Roman', serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5; padding: 40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius: 8px; overflow: hidden;">
        <tr>
          <td style="background: #B8860B; padding: 32px 40px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 1px;">${SITE_CONFIG.name}</h1>
            <p style="color: #fef3c7; margin: 4px 0 0; font-size: 13px;">Order Confirmation</p>
          </td>
        </tr>
        <tr><td style="padding: 32px 40px;">
          <p style="font-size: 16px; color: #1a1a1a; margin: 0 0 4px;">Dear <strong>${order.customerName}</strong>,</p>
          <p style="font-size: 14px; color: #6b7280; margin: 0 0 24px;">Thank you for your order! Your order has been placed successfully.</p>

          <table width="100%" cellpadding="0" cellspacing="0" style="background: #f9fafb; border-radius: 6px; margin-bottom: 24px;">
            <tr><td style="padding: 16px 20px;">
              <p style="margin: 0 0 4px; font-size: 12px; color: #6b7280;">Order ID</p>
              <p style="margin: 0; font-size: 16px; font-weight: bold; color: #B8860B;">#${order.id}</p>
            </td></tr>
          </table>

          <h3 style="font-size: 15px; color: #1a1a1a; margin: 0 0 12px;">Items Ordered</h3>
          <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
            <thead>
              <tr style="background: #f9fafb;">
                <th style="padding: 10px 8px; font-size: 12px; color: #6b7280; text-align: left; font-weight: 500;">Item</th>
                <th style="padding: 10px 8px; font-size: 12px; color: #6b7280; text-align: center; font-weight: 500;">Qty</th>
                <th style="padding: 10px 8px; font-size: 12px; color: #6b7280; text-align: right; font-weight: 500;">Price</th>
                <th style="padding: 10px 8px; font-size: 12px; color: #6b7280; text-align: right; font-weight: 500;">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3" style="padding: 12px 8px; font-size: 14px; font-weight: bold; text-align: right; color: #1a1a1a;">Total</td>
                <td style="padding: 12px 8px; font-size: 16px; font-weight: bold; text-align: right; color: #B8860B;">${formatPrice(order.totalAmount)}</td>
              </tr>
            </tfoot>
          </table>

          <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 24px;">
            <tr>
              <td width="50%" style="vertical-align: top; padding-right: 12px;">
                <p style="margin: 0 0 4px; font-size: 12px; color: #6b7280;">Delivery Address</p>
                <p style="margin: 0; font-size: 14px; color: #1a1a1a;">${order.address}</p>
              </td>
              <td width="50%" style="vertical-align: top; padding-left: 12px;">
                <p style="margin: 0 0 4px; font-size: 12px; color: #6b7280;">Payment Method</p>
                <p style="margin: 0; font-size: 14px; color: #1a1a1a;">${paymentLabel}</p>
              </td>
            </tr>
          </table>

          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />

          <p style="font-size: 13px; color: #6b7280; margin: 0;">If you have any questions, please contact us at <a href="mailto:${SITE_CONFIG.email}" style="color: #B8860B;">${SITE_CONFIG.email}</a> or call <strong>${SITE_CONFIG.phone}</strong>.</p>
        </td></tr>
        <tr>
          <td style="background: #1a1a1a; padding: 20px 40px; text-align: center;">
            <p style="color: #9ca3af; font-size: 12px; margin: 0;">${SITE_CONFIG.name} &mdash; ${SITE_CONFIG.tagline}</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export async function sendOrderConfirmation(order: OrderEmailData) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY not set — skipping email");
    return;
  }

  const html = buildOrderConfirmationHtml(order);

  await resend.emails.send({
    from: `${SITE_CONFIG.name} <${EMAIL_FROM}>`,
    to: order.customerEmail,
    subject: `Order Confirmed — #${order.id}`,
    html,
  });
}
