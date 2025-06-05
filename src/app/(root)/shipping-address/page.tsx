import { auth } from "@/auth";
import { getMyCart } from "@/lib/actions/cart.actions";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { ShipingAddress } from "@/types";

const ShippingAddress = () => {
  return <>Shipping Address</>;
};

export default ShippingAddress;
