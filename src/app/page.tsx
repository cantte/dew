import { ArrowRightIcon } from "@radix-ui/react-icons";
import NextLink from "next/link";
import Footer from "~/components/footer";
import FeaturesSection from "~/components/home/features";
import SignInButton from "~/components/signin-button";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { getServerAuthSession } from "~/server/auth";

export default async function Home() {
  const session = await getServerAuthSession();

  return (
    <main className="h-screen-ios relative z-20 mx-auto flex min-h-screen max-w-7xl flex-col overflow-x-hidden px-4">
      <header className="flex h-[80px] items-center justify-between md:h-[100px]">
        <div className="flex items-center gap-3">
          <span className="text-lg font-semibold">dew</span>
          <Badge>beta</Badge>
        </div>

        <nav className="flex items-center gap-3">
          <ul className="flex gap-2">
            {session !== null && (
              <>
                <li className="inline-flex items-center justify-center">
                  <Button size="sm" asChild>
                    <NextLink href="/dashboard">
                      Ir al panel de control
                    </NextLink>
                  </Button>
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

      <section className="relative flex h-[calc(100vh-80px)] max-w-3xl flex-col justify-center md:mx-auto md:h-[calc(100vh-100px)]">
        <div className="flex grow flex-col justify-center">
          <div className="max-w-[725px] text-center">
            <h1 className="mb-8 text-[38px] leading-[46px] md:text-[70px] md:leading-[85px]">
              Lleva un registro de tus{" "}
              <span className="text-primary">ventas </span>
              sin complicaciones
            </h1>
            <div className="text-center sm:px-20">
              <span className="text-[17px] font-normal tracking-[-0.16px] text-muted-foreground md:text-xl">
                Evita el papeleo y lleva el control de tus ventas de manera
                eficiente.
              </span>
            </div>
          </div>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Button size="lg" asChild>
              <NextLink href="/dashboard">
                Empezar ahora <ArrowRightIcon className="ml-2 h-4 w-4" />
              </NextLink>
            </Button>

            <Button size="lg" variant="outline" asChild>
              <NextLink href="#features">Saber más</NextLink>
            </Button>
          </div>
        </div>
      </section>

      <FeaturesSection />

      <Footer />
    </main>
  );
}
