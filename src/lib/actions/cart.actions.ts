"use server";

import { cookies } from "next/headers";
import { CartItem } from "@/types";
import { formatError } from "../utils";

export async function addItemToCart(data: CartItem) {
  try {
    // Check for the cart cookie
    // because it is async we must wrap this in a set of parantheses and then .get()
    const sessionCartId = (await cookies()).get("sessionCartId")?.value;
    // Testing
    console.log({ "Session Cart Id": sessionCartId });

    return {
      success: true,
      message: "Item added tp cart",
    };
  } catch (error) {
    return {
      seccess: false,
      message: formatError(error),
    };
  }
}
