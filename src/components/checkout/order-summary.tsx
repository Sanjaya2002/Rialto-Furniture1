import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/utils";
import type { CartItem } from "@/providers/cart-provider";

interface OrderSummaryProps {
  items: CartItem[];
  totalPrice: number;
}

export default function OrderSummary({ items, totalPrice }: OrderSummaryProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-luxury-black">Order Summary</h3>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="flex items-start gap-3">
            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-md bg-gray-100">
              <img
                src={item.image}
                alt={item.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-luxury-black truncate">
                {item.name}
              </p>
              <p className="text-sm text-muted-foreground">
                Qty: {item.quantity}
              </p>
              <p className="text-sm font-medium text-luxury-black">
                {formatPrice(item.price * item.quantity)}
              </p>
            </div>
          </div>
        ))}
      </div>
      <Separator />
      <div className="flex items-center justify-between">
        <span className="text-base font-semibold text-luxury-black">Total</span>
        <span className="text-lg font-bold text-luxury-gold">
          {formatPrice(totalPrice)}
        </span>
      </div>
    </div>
  );
}
