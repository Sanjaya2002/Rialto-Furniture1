interface KOKOConfig {
  apiKey: string;
  amount: number;
  orderId: string;
  customerEmail: string;
  customerPhone: string;
}

export async function initiateKOKOPayment(config: KOKOConfig) {
  const response = await fetch("https://api.koko.lk/v1/payments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      amount: config.amount,
      order_id: config.orderId,
      email: config.customerEmail,
      phone: config.customerPhone,
      callback_url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/koko/notify`,
    }),
  });

  return response.json();
}

export function getKOKOPaymentUrl(paymentId: string): string {
  return `https://pay.koko.lk/checkout/${paymentId}`;
}
