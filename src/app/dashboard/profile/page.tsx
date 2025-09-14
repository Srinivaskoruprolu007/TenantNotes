
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { updateProfile } from "firebase/auth";
import { useState } from "react";
import { MainNav } from "@/components/main-nav";
import { Loader2 } from "lucide-react";

export default function ProfilePage() {
  const { user, reloadUser } = useAuth();
  const { toast } = useToast();
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [isLoading, setIsLoading] = useState(false);
  const userAvatar = PlaceHolderImages.find((img) => img.id === "user-avatar");

  const handleProfileUpdate = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      await updateProfile(user, { displayName });
      await reloadUser(); 
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: error.message,
      });
    } finally {
        setIsLoading(false);
    }
  };

  if (!user) {
    return null;
  }
  
  return (
    <div className="grid gap-6 md:grid-cols-[180px_1fr]">
      <aside>
        <MainNav />
      </aside>
      <div className="space-y-8 animate-in fade-in duration-500">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your Profile</h1>
          <p className="text-muted-foreground">Manage your account settings.</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Profile Details</CardTitle>
            <CardDescription>Update your personal information here.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                  {user.photoURL ? (
                  <AvatarImage src={user.photoURL} alt="User avatar" />
                  ) : (
                  userAvatar && <AvatarImage src={userAvatar.imageUrl} alt="User avatar" data-ai-hint={userAvatar.imageHint} />
                  )}
                  <AvatarFallback className="text-3xl">{displayName?.charAt(0) || user.email?.charAt(0)}</AvatarFallback>
              </Avatar>
              <Button variant="outline" disabled>Change Photo</Button>
            </div>
            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name</Label>
              <Input id="displayName" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={user.email || ""} disabled />
              <p className="text-xs text-muted-foreground">
                Contact support to change your email address.
              </p>
            </div>
            <Button onClick={handleProfileUpdate} disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
