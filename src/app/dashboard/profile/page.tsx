
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
import { useEffect, useState } from "react";
import { MainNav } from "@/components/main-nav";
import { Loader2, CreditCard, CheckCircle, XCircle, ExternalLink } from "lucide-react";
import { getUserProfile, getSubscription, updateUserSubscription, Subscription } from "@/lib/firestore";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import Link from "next/link";

export default function ProfilePage() {
  const { user, reloadUser } = useAuth();
  const { toast } = useToast();
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [isLoading, setIsLoading] = useState(false);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoadingSubscription, setIsLoadingSubscription] = useState(true);
  const userAvatar = PlaceHolderImages.find((img) => img.id === "user-avatar")?.imageUrl;

  // Fetch user subscription data
  useEffect(() => {
    const fetchSubscription = async () => {
      if (!user) return;
      
      try {
        const userProfile = await getUserProfile(user.uid);
        if (userProfile?.subscriptionId) {
          const sub = await getSubscription(userProfile.subscriptionId);
          setSubscription(sub);
        }
      } catch (error) {
        console.error("Error fetching subscription:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load subscription details.",
        });
      } finally {
        setIsLoadingSubscription(false);
      }
    };

    fetchSubscription();
  }, [user, toast]);

  // Handle profile updates
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
      console.error("Profile update error:", error);
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: error.message || "An error occurred while updating your profile.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle subscription changes
  const handleSubscriptionChange = async (planId: string) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // In a real app, this would redirect to Stripe Checkout
      // For now, we'll simulate a successful subscription update
      await updateUserSubscription(user.uid, planId);
      
      // Refresh subscription data
      const userProfile = await getUserProfile(user.uid);
      if (userProfile?.subscriptionId) {
        const sub = await getSubscription(userProfile.subscriptionId);
        setSubscription(sub);
      }
      
      toast({
        title: "Success!",
        description: "Your subscription has been updated.",
      });
    } catch (error) {
      console.error("Subscription update error:", error);
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: "There was an error updating your subscription. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p>Please sign in to view your profile.</p>
      </div>
    );
  }
  
  const handleUpgrade = async (planId: string) => {
    try {
      setIsLoading(true);
      // In a real app, this would redirect to Stripe Checkout
      // For now, we'll simulate a successful subscription
      await updateUserSubscription(user!.uid, planId);
      
      toast({
        title: "Success!",
        description: "Your subscription has been updated.",
      });
      
      // Reload user data
      const userProfile = await getUserProfile(user!.uid);
      if (userProfile?.subscriptionId) {
        const sub = await getSubscription(userProfile.subscriptionId);
        setSubscription(sub);
      }
    } catch (error) {
      console.error("Upgrade failed:", error);
      toast({
        variant: "destructive",
        title: "Upgrade Failed",
        description: "There was an error processing your request. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-[200px_1fr] min-h-screen">
      <aside>
        <MainNav />
      </aside>
      <div className="space-y-6 p-4">
        {/* Profile Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
          <p className="text-muted-foreground">Manage your account information and subscription</p>
        </div>

        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
          {/* Profile Card */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center space-y-4 text-center sm:flex-row sm:space-x-4 sm:space-y-0 sm:text-left">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={user.photoURL || userAvatar} alt={user.displayName || 'User'} />
                  <AvatarFallback className="text-lg">
                    {user.displayName?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <p className="text-lg font-medium">{user.displayName || 'User'}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  <p className="text-xs text-muted-foreground">
                    Member since {user.metadata?.creationTime ? 
                      format(new Date(user.metadata.creationTime), 'MMMM yyyy') : 
                      'a while ago'}
                  </p>
                </div>
              </div>
              
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input
                    id="displayName"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Enter your name"
                    disabled={isLoading}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={user.email || ''}
                    disabled
                    className="bg-muted/50"
                  />
                  <p className="text-xs text-muted-foreground">
                    Contact support to change your email address.
                  </p>
                </div>
                
                <Button 
                  onClick={handleProfileUpdate}
                  disabled={isLoading || !displayName.trim() || displayName === user.displayName}
                  className="w-full mt-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Subscription Card */}
          <Card>
            <CardHeader>
              <CardTitle>Subscription</CardTitle>
              <CardDescription>Manage your subscription plan</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {isLoadingSubscription ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : subscription ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Current Plan</p>
                      <p className="text-sm text-muted-foreground">
                        {subscription.name} ({subscription.billingCycle})
                      </p>
                    </div>
                    <Badge variant="outline" className="uppercase">
                      {subscription.price > 0 ? 'Paid' : 'Free'}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Status</span>
                      <span className="text-sm font-medium">
                        {subscription.isActive ? (
                          <span className="flex items-center text-green-500">
                            <CheckCircle className="h-4 w-4 mr-1" /> Active
                          </span>
                        ) : (
                          <span className="flex items-center text-destructive">
                            <XCircle className="h-4 w-4 mr-1" /> Inactive
                          </span>
                        )}
                      </span>
                    </div>
                    
                    {subscription.price > 0 && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Next Billing</span>
                        <span className="text-sm font-medium">
                          {format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 'MMM d, yyyy')}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/dashboard/billing">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Manage Subscription
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    You don't have an active subscription. Choose a plan to get started.
                  </p>
                  <Button 
                    onClick={() => handleUpgrade('free')} 
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      'Select Free Plan'
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => handleUpgrade('pro')}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      'Upgrade to Pro'
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Usage Statistics */}
        <Card>
          <CardHeader>
            <CardTitle>Usage</CardTitle>
            <CardDescription>Your current resource usage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">Storage</span>
                  <span className="text-sm text-muted-foreground">
                    {subscription ? `${subscription.features.storageLimit}MB included` : 'Loading...'}
                  </span>
                </div>
                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: '25%' }} // This would be dynamic in a real app
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Notes</p>
                  <p className="text-sm text-muted-foreground">
                    15/{subscription?.features.maxNotes || '∞'} used
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Tags</p>
                  <p className="text-sm text-muted-foreground">
                    5/{subscription?.features.maxTags || '∞'} used
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
