"use client";
import { Button } from "@/components/ui/button";
import { Cart, CartItem } from "@/types";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { addItemToCart, removeItemFromCart } from "@/lib/actions/cart.actions";
import { Plus, Minus, Loader } from "lucide-react";
import { useTransition } from "react";

const AddToCart = ({ cart, item }: { cart?: Cart; item: CartItem }) => {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  // wrap the add to cart action in a transition to avoid blocking the UI
  const handleAddToCart = async () => {
    startTransition(async () => {
      // call the addItemToCart action to get the response
      const res = await addItemToCart(item);
      // display the correct toast based on the response if failed: show an error toast and if successful should navigate to the cart
      if (!res.success) {
        toast.error(res.message);
        return;
      }
      // handle success add to cart
      toast(`${res.message}`, {
        action: {
          label: "Go to Cart",
          onClick: () => router.push("/cart"),
        },
      });
    });
  };
  // Handle remove from cart
  const handleRemoveFromCart = async () => {
    startTransition(async () => {
      const res = await removeItemFromCart(item.productId);
      // handle success add to cart
      toast(`${res.message}`, {
        action: {
          label: "Go to Cart",
          onClick: () => router.push("/cart"),
        },
      });
    });
  };

  //Check if the item already exists in the cart
  const existItem =
    cart && cart.items.find((x) => x.productId === item.productId);

  return existItem ? (
    <div>
      <Button type="button" className="mt-4" onClick={handleRemoveFromCart}>
        {isPending ? (
          <Loader className="h-4 w-4 animate-spin" />
        ) : (
          <Minus className="h-4 w-4" />
        )}
      </Button>
      <span className="px-2 ">{existItem.qty}</span>
      <Button type="button" onClick={handleAddToCart}>
        {isPending ? (
          <Loader className="h-4 w-4 animate-spin" />
        ) : (
          <Plus className="h-4 w-4 " />
        )}
      </Button>
    </div>
  ) : (
    <Button className="w-full mt-4" type="button" onClick={handleAddToCart}>
      {isPending ? (
        <Loader className="h-4 w-4 animate-spin" />
      ) : (
        <Plus className="h-4 w-4 " />
      )}{" "}
      Add To Cart
    </Button>
  );
};

export default AddToCart;
