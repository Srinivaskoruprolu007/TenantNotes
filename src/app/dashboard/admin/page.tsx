import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { subscription } from "@/lib/data";
import { FileText, Users, CreditCard } from "lucide-react";

export default function AdminPage() {
  const noteUsage = (subscription.noteCount / subscription.noteLimit) * 100;
  const userUsage = (subscription.userCount / subscription.userLimit) * 100;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
       <div>
          <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
          <p className="text-muted-foreground">Manage your subscription and usage.</p>
        </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Plan</CardTitle>
             <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{subscription.plan} Tier</div>
            <p className="text-xs text-muted-foreground">
              Your company is on the {subscription.plan} plan.
            </p>
            <Button className="mt-4 w-full">Upgrade to Pro</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usage</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Notes</span>
                <span><span className="font-bold">{subscription.noteCount}</span> / {subscription.noteLimit}</span>
              </div>
              <Progress value={noteUsage} />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Users</span>
                <span><span className="font-bold">{subscription.userCount}</span> / {subscription.userLimit}</span>
              </div>
              <Progress value={userUsage} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Billing</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
             <div className="text-2xl font-bold">Manage Billing</div>
            <p className="text-xs text-muted-foreground">
                Next billing period ends on {subscription.billing_period_ends}.
            </p>
            <Button variant="secondary" className="mt-4 w-full">Manage in Stripe</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
