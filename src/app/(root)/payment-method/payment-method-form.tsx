"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { paymentMethodSchema } from "@/lib/validators";
import { useTransition } from "react";
import CheckoutSteps from "@/components/checkout-steps";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { DEFAULT_PAYMENT_METHOD } from "@/lib/constants";

const PaymentMethodForm = ({
  prefferedPaymentMethod,
}: {
  prefferedPaymentMethod: string | null;
}) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof paymentMethodSchema>>({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues: {
      type: prefferedPaymentMethod || DEFAULT_PAYMENT_METHOD, // Default to PayPal if no preferred method
    },
  });

  return (
    <>
      <CheckoutSteps current={2} />
    </>
  );
};

export default PaymentMethodForm;
