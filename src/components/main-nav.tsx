
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Notebook, User, Settings } from "lucide-react";

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();

  const routes = [
    {
      href: "/dashboard",
      label: "Notes",
      icon: Notebook,
      active: pathname === "/dashboard" || pathname.startsWith('/dashboard/notes'),
    },
    {
      href: "/dashboard/profile",
      label: "Profile",
      icon: User,
      active: pathname === "/dashboard/profile",
    },
    {
      href: "/dashboard/admin",
      label: "Admin",
      icon: Settings,
      active: pathname === "/dashboard/admin",
    },
  ];

  return (
    <nav
      className={cn("flex flex-col gap-2", className)}
      {...props}
    >
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
            route.active && "bg-muted text-primary"
          )}
        >
          <route.icon className="h-4 w-4" />
          {route.label}
        </Link>
      ))}
    </nav>
  );
}
