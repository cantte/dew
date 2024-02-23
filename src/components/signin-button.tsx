"use client";

import { signIn } from "next-auth/react";
import { Button } from "~/components/ui/button";

const SignInButton = () => {
  return <Button onClick={() => void signIn("google")}>Iniciar sesión</Button>;
};

export default SignInButton;
