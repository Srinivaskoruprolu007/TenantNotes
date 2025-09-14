
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, FileText, BarChart2, HardDrive, Clock, Tag, AlertCircle } from "lucide-react";
import Link from "next/link";
import { format } from 'date-fns';
import { MainNav } from "@/components/main-nav";
import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import { getNotesByUser, Note, getUserProfile, formatStorageSize } from "@/lib";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<{
    storageLimit: number;
    usedStorage: number;
    subscriptionId?: string;
  } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        // Fetch user profile data
        const profile = await getUserProfile(user.uid);
        if (profile) {
          setUserData({
            storageLimit: profile.storageLimit,
            usedStorage: profile.usedStorage,
            subscriptionId: profile.subscriptionId,
          });
        }

        // Fetch user's notes
        const userNotes = await getNotesByUser(user.uid);
        setNotes(userNotes);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const storagePercentage = userData
    ? Math.min(Math.round((userData.usedStorage / userData.storageLimit) * 100), 100)
    : 0;

  const isStorageCritical = storagePercentage > 90;

  return (
    <div className="grid gap-6 md:grid-cols-[200px_1fr]">
      <aside>
        <MainNav />
      </aside>
      <div className="animate-in fade-in duration-500 space-y-6">
        {/* Storage Usage */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Notes
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? <Skeleton className="h-8 w-16" /> : notes.length}</div>
              <p className="text-xs text-muted-foreground">
                {notes.length === 1 ? '1 note' : `${notes.length} notes`}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
              <HardDrive className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? (
                  <Skeleton className="h-8 w-24" />
                ) : (
                  formatStorageSize(userData ? userData.usedStorage * 1024 * 1024 : 0)
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                of {userData ? formatStorageSize(userData.storageLimit * 1024 * 1024) : '0 MB'} used
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Plan</CardTitle>
              <BarChart2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? (
                  <Skeleton className="h-8 w-20" />
                ) : userData?.subscriptionId ? (
                  'Pro'
                ) : (
                  'Free'
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {userData?.subscriptionId ? 'Pro Plan' : 'Free Plan'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Storage</CardTitle>
              <HardDrive className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  `${storagePercentage}%`
                )}
              </div>
              <div className="relative h-2 w-full overflow-hidden rounded-full bg-secondary mt-2">
                <div
                  className={`h-full ${isStorageCritical ? 'bg-destructive' : 'bg-primary'} transition-all duration-300`}
                  style={{ width: `${storagePercentage}%` }}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {isStorageCritical && (
          <div className="rounded-lg border bg-destructive/10 border-destructive/30 p-4 flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
            <div>
              <h3 className="font-medium text-destructive">Storage Almost Full</h3>
              <p className="text-sm text-destructive/90">
                You've used {storagePercentage}% of your storage. Consider deleting unused notes or upgrading your plan.
              </p>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between space-y-2">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Your Notes</h1>
            <p className="text-muted-foreground">
              {notes.length === 0 ? "You don't have any notes yet." : `You have ${notes.length} note${notes.length !== 1 ? 's' : ''}`}
            </p>
          </div>
          <Button asChild>
            <Link href="/dashboard/notes/new" className="flex items-center">
              <PlusCircle className="mr-2 h-4 w-4" />
              New Note
            </Link>
          </Button>
        </div>

        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="overflow-hidden">
                <CardHeader>
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-5/6" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : notes.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {notes.map((note) => (
              <Link key={note.id} href={`/dashboard/notes/${note.id}`} className="block">
                <Card className="h-full flex flex-col transform transition-all duration-200 hover:shadow-md hover:border-primary/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-semibold line-clamp-1">{note.title || 'Untitled Note'}</CardTitle>
                    <CardDescription className="text-xs text-muted-foreground">
                      {format(note.updatedAt?.toDate?.() || new Date(), 'MMM d, yyyy')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {note.content || 'No content'}
                    </p>
                    {note.tags && note.tags.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1">
                        {note.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground"
                          >
                            {tag}
                          </span>
                        ))}
                        {note.tags.length > 3 && (
                          <span className="text-xs text-muted-foreground">+{note.tags.length - 3} more</span>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed rounded-lg">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-1">No notes yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Get started by creating a new note
            </p>
            <Button asChild>
              <Link href="/dashboard/notes/new" className="flex items-center">
                <PlusCircle className="mr-2 h-4 w-4" />
                New Note
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
