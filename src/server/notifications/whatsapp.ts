import "server-only";

const WHATSAPP_API_URL = "https://graph.facebook.com/v21.0";

interface QuotationNotification {
  reference: string;
  customerName: string;
  customerPhone: string;
  totalItems: number;
  totalAmount: number;
}

const formatLKR = (amount: number) => `LKR ${amount.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;

/**
 * Notifies the shop on WhatsApp (Meta Cloud API template "new_quotation_notification").
 * Never throws: a failed notification must not fail the customer's request.
 */
export async function sendQuotationNotification(details: QuotationNotification): Promise<boolean> {
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const adminPhone = process.env.WHATSAPP_ADMIN_PHONE_NUMBER;

  if (!accessToken || !phoneNumberId || !adminPhone) {
    console.warn("[whatsapp] Credentials not configured; skipping quotation notification.");
    return false;
  }

  try {
    const response = await fetch(`${WHATSAPP_API_URL}/${phoneNumberId}/messages`, {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: adminPhone,
        type: "template",
        template: {
          name: "new_quotation_notification",
          language: { code: "en" },
          components: [
            {
              type: "body",
              parameters: [
                { type: "text", text: details.reference },
                { type: "text", text: details.customerName },
                { type: "text", text: details.customerPhone },
                { type: "text", text: String(details.totalItems) },
                { type: "text", text: formatLKR(details.totalAmount) },
              ],
            },
          ],
        },
      }),
    });

    if (!response.ok) {
      console.error(
        `[whatsapp] Send failed (${response.status}) for ${details.reference}:`,
        await response.text(),
      );
      return false;
    }
    return true;
  } catch (error) {
    console.error(`[whatsapp] Network error for ${details.reference}:`, error);
    return false;
  }
}
