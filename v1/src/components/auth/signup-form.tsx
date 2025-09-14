"use client";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import { motion } from "framer-motion";
import { authClient } from "@/lib/auth-client";
import { redirect } from "next/navigation";


export default function Signup() {
    const handleGoogleSignup = async() => {
        const data = await authClient.signIn.social({
            provider: "google",
          });
          if (data.error){
            window.alert("SIGNUP FAILED")
          }else{
            redirect("/")

          }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-md"
            >
                <Card className="shadow-xl rounded-2xl">
                    <CardHeader className="text-center space-y-2">
                        <CardTitle className="text-2xl font-bold">Create your account</CardTitle>
                        <CardDescription>
                            Sign up quickly using your Google account
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="flex flex-col gap-4">
                        <Button
                            onClick={handleGoogleSignup}
                            variant="outline"
                            className="flex items-center justify-center gap-2 py-6 text-base font-medium"
                        >
                            <FcGoogle className="h-6 w-6" />
                            Continue with Google
                        </Button>
                        <Separator />
                    </CardContent>

                    <CardFooter className="flex justify-center text-sm text-muted-foreground">
                        Already have an account?&nbsp;
                        <Link
                            href="/signin"
                            className="text-primary hover:underline font-medium"
                        >
                            Sign in
                        </Link>
                    </CardFooter>
                </Card>
            </motion.div>
        </div>
    );
}
