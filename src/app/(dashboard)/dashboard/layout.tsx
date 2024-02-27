import { redirect } from "next/navigation";
import { type ReactNode } from "react";
import DashboardSidebar from "~/app/(dashboard)/dashboard/sidebar";
import MobileNav from "~/components/mobile-nav";
import SignOutButton from "~/components/signout-button";
import SelectStore from "~/components/stores/select-store";
import { ThemeToggle } from "~/components/theme-toggle";
import { Badge } from "~/components/ui/badge";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Separator } from "~/components/ui/separator";
import { dashboardConfig } from "~/config/dashboard";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";

type DashboardLayoutProps = {
  children: ReactNode;
};

const DashboardLayout = async ({ children }: DashboardLayoutProps) => {
  const session = await getServerAuthSession();

  if (session === null) {
    return redirect("/api/auth/signin");
  }

  const store = await api.store.find.query();

  return (
    <main>
      <header className="flex w-full items-center justify-center border-b">
        <div className="flex h-14 w-full max-w-7xl items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <span className="hidden text-lg font-semibold md:block">dew</span>
            <Badge className="hidden md:block">beta</Badge>

            <MobileNav />

            {store !== undefined && <SelectStore store={store} />}
          </div>

          <nav className="flex items-center gap-3">
            <ul className="flex gap-2">
              <li>
                <ThemeToggle />
              </li>

              <li>
                <Separator orientation="vertical" />
              </li>

              <li className="inline-flex items-center justify-center">
                <SignOutButton />
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
