import Link from "next/link";
import { redirect } from "next/navigation";
import { type ReactNode } from "react";
import DashboardSidebar from "~/app/(dashboard)/dashboard/sidebar";
import AccountNav from "~/components/account-nav";
import MobileNav from "~/components/mobile-nav";
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

  const userPreferences = await api.userPreference.find.query();
  const store =
    userPreferences !== undefined
      ? await api.store.find.query({ id: userPreferences.storeId })
      : undefined;
  const stores = await api.store.list.query();

  return (
    <div className="grid min-h-screen w-full overflow-hidden md:grid-cols-[280px_1fr]">
      <div className="hidden border-r md:block">
        <div className="flex flex-col gap-2">
          <div className="flex h-[60px] items-center px-6">
            <Link className="flex items-center gap-3" href="/">
              <span className="text-lg font-semibold">dew</span>
              <Badge>beta</Badge>
            </Link>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-4 text-sm font-medium">
              <ScrollArea>
                <DashboardSidebar items={dashboardConfig.mainNav} />
              </ScrollArea>
            </nav>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center justify-between gap-4 border-b px-6 lg:h-[60px]">
          <div className="flex items-center gap-3">
            <MobileNav />

            {userPreferences !== undefined && (
              <SelectStore currentStore={store} stores={stores} />
            )}
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
                <AccountNav user={session.user} />
              </li>
            </ul>
          </nav>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
