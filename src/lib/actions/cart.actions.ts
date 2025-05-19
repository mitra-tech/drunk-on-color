"use server";

import { cookies } from "next/headers";
import { CartItem } from "@/types";
import { convertToPlainObject, formatError } from "../utils";
import { auth } from "@/auth";
import { prisma } from "@/db/prisma";
import { cartItemSchema } from "../validators";

export async function addItemToCart(data: CartItem) {
  try {
    // Check for the cart cookie
    // because it is an async we must wrap this in a set of parantheses and then .get()
    const sessionCartId = (await cookies()).get("sessionCartId")?.value;
    // Testing
    if (!sessionCartId) throw new Error("No cart session id found");
    // Get session and user id from the cookie
    const session = await auth();
    // if the session.user.id is NOT here will be assigned to undefined without throwing an error
    const userId = session?.user?.id ? (session.user.id as string) : undefined;

    // Get cart
    const cart = await getMyCart();
    // Parse and validate item
    const item = cartItemSchema.parse(data);

    // Testing
    console.log(
      { "Session Cart ID: ": sessionCartId },
      { "User ID: ": userId },
      { Item: item }
    );
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

// get the cart items
export async function getMyCart() {
  // Check for cart cookie
  const sessionCartId = (await cookies()).get("sessionCartId")?.value;
  if (!sessionCartId) throw new Error("No cart session id found");
  // Get session user and id
  const session = await auth();
  const userId = session?.user?.id ? (session.user.id as string) : undefined;

  // Get the users cart by user id
  const cart = await prisma.cart.findFirst({
    where: {
      sessionCartId: sessionCartId,
    },
  });
  if (!cart) return undefined;
  // Convert decimals and return
  return convertToPlainObject({
    ...cart,
    items: cart.items as CartItem[],
    itemsPrice: cart.itemsPrice.toString(),
    totalPrice: cart.totalPrice.toString(),
    shippingPrice: cart.shippingPrice.toString(),
    taxPrice: cart.taxPrice.toString(),
  });
}
