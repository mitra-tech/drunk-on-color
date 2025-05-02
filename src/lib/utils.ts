import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// convert a prisma object into a plain JS object
// T: means for example if the paremeter type is a product object the type of return should be an object
export function convertToPlainObject<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}
