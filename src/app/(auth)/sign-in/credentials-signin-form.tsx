"use client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { signInDefaultValues } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import Link from "next/link";
const CredentialsSignInForm = () => {
  return (
    <form className="space-y-6">
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
        <Button className="w-full" variant="default">
          Sign In
        </Button>
        <div className="text-sm text-center text-muted-foreground mt-2">
          Don&apos;t have an account? {""}
          <Link href="/sign-up" className="link" target="_self">
            Sign up
          </Link>
        </div>
      </div>
    </form>
  );
};

export default CredentialsSignInForm;
