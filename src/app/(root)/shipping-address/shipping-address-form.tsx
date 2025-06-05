"use client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useTransition } from "react";
import { shippingAddressDefaultValues } from "@/lib/constants";
import { shippingAddressSchema } from "@/lib/validators";
import { ShippingAddress } from "@/types";

const ShippingAddressForm = ({ address }: { address: ShippingAddress }) => {
  return <>Shipping Address Form</>;
};

export default ShippingAddressForm;
