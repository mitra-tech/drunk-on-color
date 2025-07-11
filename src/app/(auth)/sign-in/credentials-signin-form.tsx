"use client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { signInDefaultValues } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { signInWithCredentials } from "@/lib/actions/user.actions";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useSearchParams } from "next/navigation";

const CredentialsSignInForm = () => {
  // we want to hook the form with the signInWithCredentials() and data is our action state which includes success and message
  const [data, action] = useActionState(
    // we are hooking this for with signInWithCredentials
    signInWithCredentials,
    {
      // default action state
      success: false,
      message: "",
    }
  );

  // because this is a client component we use the hook instead of passing props to the component
  const searchParams = useSearchParams();
  // if the callbackUrl is there it will be set to the variable(callbackUrl) if not, it is going to be set to the '/'
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const SignInButton = () => {
    const { pending } = useFormStatus();
    return (
      <Button disabled={pending} className="w-full" variant="default">
        {pending ? "Signing In ..." : "Sign In"}
      </Button>
    );
  };

  return (
    // action= {action} sets the action attribute to the action on the top and not directly to the signInWithCredentials
    <form action={action}>
      {/* we need to persist the callbackurl to the submitted page in the form so we just send it as an hidden input */}
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      <div className="space-y-6">
        <div>
          <Label htmlFor="email" className="mb-2">
            Email
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            defaultValue={signInDefaultValues.email}
          />
        </div>
        <div>
          <Label htmlFor="password" className="mb-2">
            Password
          </Label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="password"
            defaultValue={signInDefaultValues.password}
          />
        </div>
        <div>
          <div>
            <SignInButton />
          </div>
          {data && !data.success && (
            <div className="text-center text-destructive">{data.message}</div>
          )}
          <div className="text-sm text-center text-muted-foreground mt-2">
            Don&apos;t have an account? {""}
            <Link href="/sign-up" className="link" target="_self">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </form>
  );
};

export default CredentialsSignInForm;
