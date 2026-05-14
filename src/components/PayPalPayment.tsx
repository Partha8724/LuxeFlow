import React from 'react';
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { Loader2 } from 'lucide-react';

interface PayPalPaymentProps {
  amount: number;
  currency: string;
  onSuccess: (details: any) => void;
  onError: (error: any) => void;
}

export default function PayPalPayment({ amount, currency, onSuccess, onError }: PayPalPaymentProps) {
  const [{ isPending }] = usePayPalScriptReducer();

  return (
    <div className="w-full min-h-[150px] relative">
      {isPending && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm z-10">
          <Loader2 className="animate-spin text-luxury-gold" size={32} />
        </div>
      )}
      <PayPalButtons
        style={{ layout: "vertical", color: "gold", shape: "rect", label: "pay" }}
        createOrder={(data, actions) => {
          return actions.order.create({
            intent: "CAPTURE",
            purchase_units: [
              {
                amount: {
                  currency_code: currency,
                  value: amount.toString(),
                },
              },
            ],
          });
        }}
        onApprove={async (data, actions) => {
          if (actions.order) {
            const details = await actions.order.capture();
            onSuccess(details);
          }
        }}
        onError={(err) => {
          console.error("PayPal Error:", err);
          onError(err);
        }}
      />
    </div>
  );
}
