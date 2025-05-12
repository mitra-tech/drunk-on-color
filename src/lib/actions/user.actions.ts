"use server";

import { signIn, signOut } from "../../auth";
import { signInFormSchema, signUpFormSchema } from "../validators";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { hashSync } from "bcrypt-ts-edge";
import { prisma } from "@/db/prisma";
import { formatError } from "../utils";

// Sign in the with credentials
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
    // this returns the action state object that has an email and message
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

// Sign up user
// So because we want to submit the sign up form with useActionState the first arg is always prevState
export async function signUpUser(prevState: unknown, formData: FormData) {
  try {
    const user = signUpFormSchema.parse({
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    });
    // plain password
    const plainPassword = user.password;
    // hash the password
    user.password = hashSync(user.password, 10);
    //add the password to the database
    await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: user.password,
      },
    });
    // we can sign the user in or ask the user to manually sign in
    await signIn("credentials", {
      email: user.email,
      // we passed the plain password not the hashed password
      password: plainPassword,
    });
    return { success: true, message: "User registered seccessfully." };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    return { success: false, message: formatError(error) };
  }
}
