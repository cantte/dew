"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Button } from "~/components/ui/button";

const SignInButton = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  return (
    <Button
      onClick={() =>
        void signIn("google", {
          callbackUrl: callbackUrl ?? "/dashboard",
        })
      }
    >
      Iniciar sesión
    </Button>
  );
};

export default SignInButton;
