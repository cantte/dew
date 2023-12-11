import { type ReactNode } from "react";
import { redirect } from "next/navigation";
import { getServerAuthSession } from "~/server/auth";
import { ScrollArea } from "~/components/ui/scroll-area";
import DashboardSidebar from "~/app/(dashboard)/dashboard/sidebar";
import { type SidebarNavItem } from "~/types/nav";
import { Badge } from "~/components/ui/badge";
import NextLink from "next/link";
import { Button } from "~/components/ui/button";
import MobileNav from "~/components/mobile-nav";
import { dashboardConfig } from "~/config/dashboard";

type DashboardLayoutProps = {
  children: ReactNode;
};

const DashboardLayout = async ({ children }: DashboardLayoutProps) => {
  const session = await getServerAuthSession();

  if (session === null) {
    return redirect("/api/auth/signin");
  }

  return (
    <main>
      <header className="flex w-full items-center justify-center border-b">
        <div className="flex h-14 w-full max-w-7xl items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <span className="hidden text-lg font-semibold md:block">dew</span>
            <Badge className="hidden md:block">alfa</Badge>

            <MobileNav />

            <ul className="flex hidden gap-2 md:block">
              <li className="inline-flex items-center justify-center">
                <NextLink href="/products/create">
                  <span className="inline-flex h-8 w-full items-center justify-center rounded-md px-2 text-sm text-neutral-700 outline-none hover:bg-black/10 hover:text-neutral-800 focus:bg-black/10">
                    Crear producto
                  </span>
                </NextLink>
              </li>
            </ul>
          </div>

          <nav className="flex items-center gap-3">
            <ul className="flex gap-2">
              <li className="inline-flex items-center justify-center">
                <NextLink
                  href="/api/auth/signout"
                  className="text-sm font-semibold"
                >
                  <span className="inline-flex h-8 w-full items-center justify-center rounded-md px-2 text-sm text-neutral-700 outline-none hover:bg-black/10 hover:text-neutral-800 focus:bg-black/10">
                    Cerrar sesión
                  </span>
                </NextLink>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      <div>
        <div className="container mt-4 flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
          <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-5rem)] w-full shrink-0 md:sticky md:block">
            <ScrollArea>
              <DashboardSidebar items={dashboardConfig.mainNav} />
            </ScrollArea>
          </aside>
          {children}
        </div>
      </div>
    </main>
  );
};

export default DashboardLayout;
