"use server";
import { prisma } from "@/db/prisma";
import { convertToPlainObject, formatError } from "../utils";
import { Prisma } from "@prisma/client";
import { PAGE_SIZE } from "../constants";
import { revalidatePath } from "next/cache";
// what prisma client returns is an object and we need to convert it to a palain JS object

// get latest products
export async function getLatestProducts() {
  // data is a prisma object
  const data = await prisma.product.findMany({
    // take: how many we want
    take: 4,
    orderBy: { createdAt: "desc" },
  });
  // we got an error aboutthe type of data object for not being a JS object (it was a prisma client object) then we passed the data to convertToPlainObject to conver it to plain JS object
  return convertToPlainObject(data);
}

// get single product by its slug
export async function getProductBySlug(slug: string) {
  // find the first slug where the slug is equal to the slug is passed in
  return await prisma.product.findFirst({
    where: { slug: slug },
  });
}

// Get all products
export async function getAllProducts({
  query,
  limit = PAGE_SIZE,
  page,
  category,
  price,
  rating,
  sort,
}: {
  query: string;
  limit?: number;
  page: number;
  category?: string;
  price?: string;
  rating?: string;
  sort?: string;
}) {
  // Query filter
  const queryFilter: Prisma.ProductWhereInput =
    query && query !== "all"
      ? {
          name: {
            contains: query,
            mode: "insensitive",
          } as Prisma.StringFilter,
        }
      : {};

  // Category filter
  const categoryFilter = category && category !== "all" ? { category } : {};

  // Price filter
  const priceFilter: Prisma.ProductWhereInput =
    price && price !== "all"
      ? {
          price: {
            gte: Number(price.split("-")[0]),
            lte: Number(price.split("-")[1]),
          },
        }
      : {};

  // Rating filter
  const ratingFilter =
    rating && rating !== "all"
      ? {
          rating: {
            gte: Number(rating),
          },
        }
      : {};

  const data = await prisma.product.findMany({
    where: {
      ...queryFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
    },
    orderBy:
      sort === "lowest"
        ? { price: "asc" }
        : sort === "highest"
        ? { price: "desc" }
        : sort === "rating"
        ? { rating: "desc" }
        : { createdAt: "desc" },
    skip: (page - 1) * limit,
    take: limit,
  });

  const dataCount = await prisma.product.count();

  return {
    data,
    totalPages: Math.ceil(dataCount / limit),
  };
}

// Delete an order
export async function deleteOrder(id: string) {
  try {
    await prisma.order.delete({ where: { id } });

    revalidatePath("/admin/orders");

    return {
      success: true,
      message: "Order deleted successfully",
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}
