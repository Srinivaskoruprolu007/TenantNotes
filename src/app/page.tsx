
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NotebookText, Loader2 } from "lucide-react";
import { signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, AuthProvider as FirebaseAuthProvider } from "firebase/auth";
import { auth, googleProvider, githubProvider } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

export default function LoginPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<"google" | "github" | "email" | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);


  const handleSocialSignIn = async (providerName: "google" | "github") => {
    setIsLoading(providerName);
    let provider: FirebaseAuthProvider;
    if (providerName === 'google') {
        provider = googleProvider;
    } else {
        provider = githubProvider;
    }
    
    try {
      await signInWithPopup(auth, provider);
      // The redirect is now handled by the useEffect hook
    } catch (error: any) {
      console.error("Authentication failed:", error);
      toast({
        variant: "destructive",
        title: "Authentication Failed",
        description: error.message || "Could not sign in. Please check configuration and try again.",
      });
    } finally {
      setIsLoading(null);
    }
  };

  const handleEmailSignUp = async () => {
    setIsLoading("email");
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      // The redirect is now handled by the useEffect hook
    } catch (error: any) {
      console.error("Sign up failed:", error);
      toast({
        variant: "destructive",
        title: "Sign Up Failed",
        description: error.message || "Could not create account. Please try again.",
      });
    } finally {
      setIsLoading(null);
    }
  };

  const handleEmailSignIn = async () => {
    setIsLoading("email");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // The redirect is now handled by the useEffect hook
    } catch (error: any) {
      console.error("Sign in failed:", error);
      toast({
        variant: "destructive",
        title: "Sign In Failed",
        description: error.message || "Could not sign in. Please check your credentials.",
      });
    } finally {
      setIsLoading(null);
    }
  };

  if (loading || user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center items-center mb-6">
          <NotebookText className="h-8 w-8 text-primary" />
          <h1 className="ml-2 text-3xl font-bold text-primary">TenantNotes</h1>
        </div>
        <Tabs defaultValue="sign-in" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="sign-in">Sign In</TabsTrigger>
            <TabsTrigger value="sign-up">Sign Up</TabsTrigger>
          </TabsList>
          <TabsContent value="sign-in">
            <Card>
              <CardHeader>
                <CardTitle>Welcome Back</CardTitle>
                <CardDescription>
                  Enter your credentials to access your account.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email-signin">Email</Label>
                  <Input id="email-signin" type="email" placeholder="m@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password-signin">Password</Label>
                  <Input id="password-signin" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                 <Button onClick={handleEmailSignIn} className="w-full" disabled={isLoading !== null}>
                  {isLoading === 'email' ? <Loader2 className="animate-spin" /> : "Sign In"}
                </Button>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">
                      Or continue with
                    </span>
                  </div>
                </div>
                 <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" onClick={() => handleSocialSignIn("google")} disabled={isLoading !== null}>
                    {isLoading === 'google' ? <Loader2 className="animate-spin" /> : "Google"}
                  </Button>
                  <Button variant="outline" onClick={() => handleSocialSignIn("github")} disabled={isLoading !== null}>
                     {isLoading === 'github' ? <Loader2 className="animate-spin" /> : "GitHub"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="sign-up">
            <Card>
              <CardHeader>
                <CardTitle>Create an account</CardTitle>
                <CardDescription>
                  Enter your email below to create your account.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div className="space-y-2">
                  <Label htmlFor="email-signup">Email</Label>
                  <Input id="email-signup" type="email" placeholder="m@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password-signup">Password</Label>
                  <Input id="password-signup" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <Button onClick={handleEmailSignUp} className="w-full" disabled={isLoading !== null}>
                  {isLoading === 'email' ? <Loader2 className="animate-spin" /> : "Sign Up"}
                </Button>
                 <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">
                      Or continue with
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" onClick={() => handleSocialSignIn("google")} disabled={isLoading !== null}>
                    {isLoading === 'google' ? <Loader2 className="animate-spin" /> : "Google"}
                  </Button>
                  <Button variant="outline" onClick={() => handleSocialSignIn("github")} disabled={isLoading !== null}>
                     {isLoading === 'github' ? <Loader2 className="animate-spin" /> : "GitHub"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
