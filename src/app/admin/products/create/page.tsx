import { Metadata } from "next";
import { requireAdmin } from "@/lib/auth-guard";
export const metadata: Metadata = {
  title: "Create Product",
};

const CreateProductPage = async () => {
  await requireAdmin();
  return (
    <>
      <h2 className="h2-bold">Create Product</h2>
      <div className="my-8">{/* <ProductForm /> */}</div>
    </>
  );
};

export default CreateProductPage;
