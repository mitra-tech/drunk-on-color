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

// Format number with decimal places
export function formatNumberWithDecimal(num: number): string {
  const [int, decimal] = num.toString().split(".");
  return decimal ? `${int}.${decimal.padEnd(2, "0")}` : `${int}.00`;
}

// Format Errors
// We can add a type from prisma and zod, bur for now we ignore the any type
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function formatErrors(error: any) {
  if (error.name === "ZodError") {
    // Handle Zod error
    // error.errors is array of objects and the key is 0 for the first one and 1 for the second one
    const fieldErrors = Object.keys(error.errors).map(
      // error.errors[field] => one of the objects of the array
      (field) => error.errors[field].message
    );
    return fieldErrors.join(".");
  } else if (
    error.name === "PrismaClientKnownRequestError" &&
    error.code === "P2002"
  ) {
    // Handle prisma error
  } else {
    // Handle other errors
  }
}
