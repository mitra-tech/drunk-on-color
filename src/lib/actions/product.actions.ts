"use server";

import { PrismaClient } from "@/generated/prisma";
import { convertToPlainObject } from "../utils";

// what prisma client returns is an object and we need to convert it to a palain JS object

// get latest products
export async function getLatestProducts() {
  const prisma = new PrismaClient();
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
  const prisma = new PrismaClient();

  // find the first slug where the slug is equal to the slug is passed in
  return await prisma.product.findFirst({
    where: { slug: slug },
  });
}
