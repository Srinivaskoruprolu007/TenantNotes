
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { NotebookText } from "lucide-react";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider, githubProvider } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<"google" | "github" | null>(null);

  const handleSignIn = async (provider: "google" | "github") => {
    setIsLoading(provider);
    const authProvider = provider === 'google' ? googleProvider : githubProvider;
    try {
      await signInWithPopup(auth, authProvider);
      router.push("/dashboard");
    } catch (error) {
      console.error("Authentication failed:", error);
      toast({
        variant: "destructive",
        title: "Authentication Failed",
        description: "Could not sign in. Please try again.",
      });
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center items-center mb-6">
          <NotebookText className="h-8 w-8 text-primary" />
          <h1 className="ml-2 text-3xl font-bold text-primary">TenantNotes</h1>
        </div>
        <Card className="shadow-lg">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl">Welcome</CardTitle>
            <CardDescription>Sign in to access your account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => handleSignIn("google")}
              disabled={isLoading !== null}
            >
              {isLoading === 'google' ? <Loader2 className="animate-spin" /> : "Sign in with Google"}
            </Button>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => handleSignIn("github")}
              disabled={isLoading !== null}
            >
              {isLoading === 'github' ? <Loader2 className="animate-spin" /> : "Sign in with Github"}
            </Button>
          </CardContent>
        </Card>
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href="#" className="underline">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
