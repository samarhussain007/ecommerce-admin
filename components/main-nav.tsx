"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

function MainNav({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  const pathName = usePathname();
  console.log(pathName);
  const params = useParams();
  const routes = [
    {
      href: `/${params.storeid}`,
      label: "Dashboard",
      active: pathName === `/${params.storeid}`,
    },
    {
      href: `/${params.storeid}/billboards`,
      label: "Billboards",
      active: pathName === `/${params.storeid}/billboards`,
    },
    {
      href: `/${params.storeid}/categories`,
      label: "Categories",
      active: pathName === `/${params.storeid}/categories`,
    },
    {
      href: `/${params.storeid}/sizes`,
      label: "Sizes",
      active: pathName === `/${params.storeid}/sizes`,
    },
    {
      href: `/${params.storeid}/colors`,
      label: "Colors",
      active: pathName === `/${params.storeid}/colors`,
    },
    {
      href: `/${params.storeid}/products`,
      label: "Products",
      active: pathName === `/${params.storeid}/products`,
    },
    {
      href: `/${params.storeid}/settings`,
      label: "Settings",
      active: pathName === `/${params.storeid}/settings`,
    },
  ];
  return (
    <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)}>
      {routes.map((route, index) => (
        <Link
          href={route.href}
          key={route.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            route.active
              ? "text-black dark:text-white"
              : "text-muted-foreground"
          )}
        >
          {route.label}
        </Link>
      ))}
    </nav>
  );
}

export { MainNav };
