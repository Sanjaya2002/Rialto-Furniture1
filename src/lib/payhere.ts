interface PayHereConfig {
  merchant_id: string;
  merchant_secret: string;
  amount: number;
  order_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  return_url?: string;
  cancel_url?: string;
  notify_url?: string;
}

export function generatePayHereHash(merchantId: string, merchantSecret: string, amount: string): string {
  return `${merchantId}_${amount}_hash`;
}

export function getPayHereCheckoutUrl(): string {
  return "https://sandbox.payhere.lk/pay/checkout";
}

export function getPayHereFormFields(config: PayHereConfig) {
  return {
    merchant_id: config.merchant_id,
    return_url: config.return_url,
    cancel_url: config.cancel_url,
    notify_url: config.notify_url,
    order_id: config.order_id,
    items: `Rialto Furniture Order #${config.order_id}`,
    currency: "LKR",
    amount: config.amount.toFixed(2),
    first_name: config.customer_name.split(" ")[0] || "",
    last_name: config.customer_name.split(" ").slice(1).join(" ") || "",
    email: config.customer_email,
    phone: config.customer_phone,
    address: "",
    city: "Colombo",
    country: "Sri Lanka",
    hash: generatePayHereHash(
      config.merchant_id,
      config.merchant_secret,
      (config.amount * 100).toString()
    ),
  };
}
