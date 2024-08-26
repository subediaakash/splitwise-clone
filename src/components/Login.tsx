"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { signIn } from "next-auth/react";
import Link from "next/link";

import { useRouter } from "next/navigation";
import { FormEvent } from "react";
import { z } from "zod";

export default function Login() {
  const router = useRouter();

  const userSchema = z.object({
    email: z.string(),
    password: z.string(),
  });
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    console.log("checkpost handlesubmit");
    const res = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),

      redirect: false,
    });

    if (!res || res.error) {
      console.log("unsuccessful");

      return <h1>Error loading the data</h1>;
    }

    if (res.ok) {
      console.log("successfull");

      <h1>login success</h1>;

      router.push("/");
      return router.refresh();
    }
  }
  return (
    <form onSubmit={handleSubmit}>
      <div className="mx-auto max-w-[400px] space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Login</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Enter your email and password to log in
          </p>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              name="email"
              id="email"
              placeholder="m@example.com"
              required
              type="email"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input name="password" id="password" required type="password" />
          </div>
          <Button className="w-full" type="submit">
            Sign In
          </Button>

          <div className="mt-4 text-center text-sm">
            Don't have an account yet?
            <Link className="underline" href="#">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </form>
  );
}