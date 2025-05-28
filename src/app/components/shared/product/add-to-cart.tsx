"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Plus, Loader } from "lucide-react";
import { Cart, CartItem } from "@/types";

import { addItemToCart } from "@/lib/actions/cart.actions";
import { useTransition } from "react";
import { toast } from "sonner";

const AddToCart = ({ cart, item }: { cart?: Cart; item: CartItem }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleAddToCart = async () => {
    startTransition(async () => {
      try {
        const res = await addItemToCart(item);

        if (!res?.success) {
          toast.error(res?.message || "Failed to add to cart.");
          return;
        }

        toast.success(res.message, {
          action: {
            label: "Go To Cart",
            onClick: () => router.push("/cart"),
          },
        });
      } catch (err) {
        toast.error("Something went wrong while adding the item.");
        console.error("Error in addItemToCart:", err);
      }
    });
  };

  // Check if item is in cart
  const existItem =
    cart && cart.items.find((x) => x.productId === item.productId);
  return existItem ? (
    <div>
      <span className="px-2">{existItem.qty}</span>
      <Button type="button" variant="outline" onClick={handleAddToCart}>
        {isPending ? (
          <Loader className="w-4 h-4 animate-spin" />
        ) : (
          <Plus className="w-4 h-4" />
        )}
      </Button>
    </div>
  ) : (
    <Button className="w-full" type="button" onClick={handleAddToCart}>
      {isPending ? (
        <Loader className="w-4 h-4 animate-spin" />
      ) : (
        <Plus className="w-4 h-4" />
      )}
      Add To Cart
    </Button>
  );
};

export default AddToCart;
