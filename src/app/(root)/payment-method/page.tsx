import { Metadata } from "next";
import { auth } from "@/auth";
import { getUserById } from "@/lib/actions/user.actions";
import PaymentMethodForm from "./payment-method-form";

export const metadata: Metadata = {
  title: "Select Payment Method",
};

const PaymentMethodPage = async () => {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) throw new Error("User not found");

  // if there is a user we want to get the user from database and we can access to the payment method
  const user = await getUserById(userId);

  return (
    <>
      <PaymentMethodForm prefferedPaymentMethod={user.paymentMethod} />
    </>
  );
};

export default PaymentMethodPage;
