import NextLink from "next/link";
import Footer from "~/components/footer";
import SignInButton from "~/components/signin-button";
import SignOutButton from "~/components/signout-button";
import { Badge } from "~/components/ui/badge";
import { getServerAuthSession } from "~/server/auth";

export default async function Home() {
  const session = await getServerAuthSession();

  return (
    <main className="h-screen-ios relative z-20 mx-auto flex h-screen max-w-7xl flex-col justify-between overflow-x-hidden px-4">
      <header className="flex h-[80px] items-center justify-between md:h-[100px]">
        <div className="flex items-center gap-3">
          <span className="text-lg font-semibold">dew</span>
          <Badge>beta</Badge>

          <ul className="flex gap-2">
            {session !== null && (
              <li className="inline-flex items-center justify-center">
                <NextLink href="/dashboard">
                  <span className="inline-flex h-8 w-full items-center justify-center rounded-md px-2 text-sm text-foreground hover:text-muted-foreground">
                    Panel de control
                  </span>
                </NextLink>
              </li>
            )}
          </ul>
        </div>

        <nav className="flex items-center gap-3">
          <ul className="flex gap-2">
            {session !== null && (
              <>
                <li className="inline-flex items-center justify-center">
                  <SignOutButton />
                </li>
              </>
            )}

            {session === null && (
              <li className="inline-flex items-center justify-center">
                <SignInButton />
              </li>
            )}
          </ul>
        </nav>
      </header>

      <div className="relative flex max-w-3xl flex-col justify-center md:mx-auto">
        <div className="max-w-[725px] text-center">
          <h1 className="relative mb-8 text-[38px] leading-[46px] md:text-[70px] md:leading-[85px]">
            Software de facturación para pequeñas empresas
          </h1>
          <div className="sm:px-20">
            <span className="text-[17px] font-normal tracking-[-0.16px] text-muted-foreground md:text-xl">
              <span className="font-medium text-foreground">dew</span> es un
              software de facturación y gestión de clientes para pequeñas
              empresas. Con{" "}
              <span className="font-medium text-foreground">dew</span> podrás
              gestionar tus clientes, crear facturas, presupuestos y mucho más.
            </span>
          </div>
        </div>

        {session === null && (
          <div className="mt-10 flex items-center justify-center gap-4">
            <SignInButton />
          </div>
        )}

        <span className="rainbow-border mb-10 mt-10 inline-flex w-fit items-center justify-center self-center text-[14px]">
          <span className="inline-flex items-center gap-1 whitespace-nowrap px-3 py-1">
            Estamos en nuestra versión inicial
          </span>
        </span>
      </div>

      <Footer />
    </main>
  );
}
