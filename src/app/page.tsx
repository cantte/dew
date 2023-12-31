import { getServerAuthSession } from "~/server/auth";
import NextLink from "next/link";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import Footer from "~/components/footer";

export default async function Home() {
  const session = await getServerAuthSession();

  return (
    <main className="h-screen-ios relative z-20 mx-auto flex h-screen max-w-7xl flex-col justify-between overflow-x-hidden px-4">
      <header className="flex h-[80px] items-center justify-between md:h-[100px]">
        <div className="flex items-center gap-3">
          <span className="text-lg font-semibold">dew</span>
          <Badge>alfa</Badge>

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
                  <NextLink
                    href="/api/auth/signout"
                    className="text-sm font-semibold"
                  >
                    <span className="inline-flex h-8 w-full items-center justify-center rounded-md px-2 text-sm text-muted-foreground hover:text-muted-foreground/80">
                      Cerrar sesión
                    </span>
                  </NextLink>
                </li>
              </>
            )}

            {session === null && (
              <li className="inline-flex items-center justify-center">
                <Button asChild variant="ghost">
                  <NextLink
                    href="/api/auth/signin"
                    className="text-sm font-semibold"
                  >
                    Iniciar sesión
                  </NextLink>
                </Button>
              </li>
            )}
          </ul>
        </nav>
      </header>

      <div className="relative flex max-w-3xl flex-col justify-center md:mx-auto">
        <div className="max-w-[725px] text-center">
          <h1 className="relative mb-8 text-[38px] font-bold leading-[46px] tracking-[-1.024px;] !text-foreground/80 md:text-[70px] md:leading-[85px]">
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
            <Button asChild size="lg">
              <NextLink href="/api/auth/signin">Iniciar sesión</NextLink>
            </Button>
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
