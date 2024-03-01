import { ChevronLeftIcon } from "@radix-ui/react-icons";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import SignInButton from "~/components/signin-button";
import { buttonVariants } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { authOptions } from "~/server/auth";

export const metadata = {
  title: "dew | iniciar sesión",
  description: "software de facturación",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const SignInPage = async () => {
  const session = await getServerSession(authOptions);
  if (session) {
    return redirect("/");
  }

  return (
    <main className="container flex h-screen w-screen flex-col items-center justify-center">
      <Link
        href="/"
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "absolute left-4 top-4 md:left-8 md:top-8",
        )}
      >
        <>
          <ChevronLeftIcon className="mr-2 h-4 w-4" />
          Regresar
        </>
      </Link>
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 rounded border border-dashed p-4 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Bienvenido</h1>
          <p className="text-sm text-muted-foreground">
            Inicia sesión para acceder a nuestros servicios.
          </p>
        </div>

        <SignInButton />
      </div>
    </main>
  );
};

export default SignInPage;
