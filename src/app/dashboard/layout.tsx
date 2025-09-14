
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
      <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
        <div className="hidden border-r bg-card md:block">
          <div className="flex h-full max-h-screen flex-col gap-2">
            <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
              <Link href="/dashboard" className="flex items-center gap-2 font-semibold text-primary">
                <NotebookText className="h-6 w-6" />
                <span className="">TenantNotes</span>
              </Link>
            </div>
            <div className="flex-1">
              <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                <MainNav />
              </nav>
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <header className="flex h-14 items-center gap-4 border-b bg-card px-4 lg:h-[60px] lg:px-6">
            <div className="w-full flex-1">
              {/* Add mobile navigation trigger here if needed */}
            </div>
            <UserNav />
          </header>
          <main className="flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 bg-background">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
