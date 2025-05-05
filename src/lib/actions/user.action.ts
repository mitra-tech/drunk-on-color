"use server";

import { signIn, signOut } from "@/auth";
import { signInFormSchema } from "../validators";
export { signIn, signOut } from "@/auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";

// Sign in the user with credentials
// The reason that this method takes to args is we want to use a new React hook called "useActionState" and when we submit an action with that hook, the first arg is gonna be "prevState", and the second arg is going to be formData
// When we have actions we can put the action in the action attribute of the form tag in the HTML or JSX
export async function signInWithCredentials(
  prevState: unknown,
  formData: FormData
) {
  try {
    // we do the validation first and parse it and then retrieving the email and password
    const user = signInFormSchema.parse({
      email: formData.get("email"),
      password: formData.get("password"),
    });
    // credentials is the type of the provider we are using to sign in
    await signIn("credentials", user);
    return { success: true, message: "Signed in successfully" };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    return { success: false, message: "Invalid email or password" };
  }
}

// Sign user out
export async function signOutUser() {
  // kills the cookies and token, ...
  await signOut();
}
