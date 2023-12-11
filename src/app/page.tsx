import { getServerAuthSession } from "~/server/auth";
import NextLink from "next/link";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";

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
                  <span className="inline-flex h-8 w-full items-center justify-center rounded-md px-2 text-sm text-neutral-700 outline-none hover:bg-black/10 hover:text-neutral-800 focus:bg-black/10">
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
                    <span className="inline-flex h-8 w-full items-center justify-center rounded-md px-2 text-sm text-neutral-700 outline-none hover:bg-black/10 hover:text-neutral-800 focus:bg-black/10">
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
          <h1 className="relative mb-8 text-[38px] font-bold leading-[46px] tracking-[-1.024px;] !text-black/80 md:text-[70px] md:leading-[85px]">
            Software de facturación para pequeñas empresas
          </h1>
          <div className="sm:px-20">
            <span className="text-[17px] font-normal tracking-[-0.16px] text-neutral-600 md:text-xl">
              <span className="font-medium text-black">dew</span> es un software
              de facturación y gestión de clientes para pequeñas empresas. Con{" "}
              <span className="font-medium text-black">dew</span> podrás
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

      <footer className="flex h-[80px] flex-col items-center justify-center text-center">
        <span className="inline-flex items-center gap-2 text-sm font-normal text-neutral-400">
          {new Date().getFullYear()} © dew
        </span>
        <span className="inline-flex items-center gap-2 text-sm font-normal text-neutral-400">
          Creado con <span className="text-red-500">❤</span> por
          <a
            href="https://github.com/cantte"
            target="_blank"
            className="text-black transition-colors duration-200 hover:text-black/80"
          >
            cantte
          </a>
        </span>
      </footer>
    </main>
  );
}
