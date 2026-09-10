const WHATSAPP_API_URL = "https://graph.facebook.com/v21.0";

interface WhatsAppQuoteDetails {
  reference: string;
  customerName: string;
  customerPhone: string;
  totalItems: number;
  totalAmount: number;
  itemsSummary: string;
}

async function hasWhatsAppCredentials(): Promise<boolean> {
  return Boolean(
    process.env.WHATSAPP_ACCESS_TOKEN &&
      process.env.WHATSAPP_PHONE_NUMBER_ID &&
      process.env.WHATSAPP_ADMIN_PHONE_NUMBER
  );
}

function formatLKR(amount: number): string {
  return `LKR ${amount.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

export async function sendQuotationNotification(
  details: WhatsAppQuoteDetails
): Promise<{ success: boolean }> {
  if (!(await hasWhatsAppCredentials())) {
    console.warn(
      "[WhatsApp] Credentials not configured (WHATSAPP_ACCESS_TOKEN / WHATSAPP_PHONE_NUMBER_ID / WHATSAPP_ADMIN_PHONE_NUMBER). " +
        "Quotation saved; admin notification skipped."
    );
    return { success: false };
  }

  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const adminPhone = process.env.WHATSAPP_ADMIN_PHONE_NUMBER;

  const messageTemplate = {
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
  };

  try {
    const response = await fetch(`${WHATSAPP_API_URL}/${phoneNumberId}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(messageTemplate),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(
        `[WhatsApp] Send failed (status ${response.status}). Quotation preserved; notification error logged only.\n${errorBody}`
      );
      return { success: false };
    }

    return { success: true };
  } catch (error) {
    console.error(
      "[WhatsApp] Network error while sending notification. Quotation preserved; notification error logged only.",
      error instanceof Error ? error.message : error
    );
    return { success: false };
  }
}