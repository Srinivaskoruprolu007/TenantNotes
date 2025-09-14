
'use client';

import { MainNav } from "@/components/main-nav";
import { UserNav } from "@/components/user-nav";
import { NotebookText } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);
  
  if (loading || !user) {
    return null; 
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold text-primary">
          <NotebookText className="h-6 w-6" />
          <span className="">TenantNotes</span>
        </Link>
        <div className="ml-auto flex items-center gap-4">
           <UserNav />
        </div>
      </header>
      <main className="flex min-h-[calc(100vh_-_4rem)] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
        <div className="mx-auto grid w-full max-w-6xl gap-2">
            {children}
        </div>
      </main>
    </div>
  );
}
