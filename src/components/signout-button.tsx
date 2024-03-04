"use client";

import { signOut } from "next-auth/react";
import { Button } from "~/components/ui/button";

const SignOutButton = () => {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="w-full"
      onClick={() => void signOut()}
    >
      Cerrar sesión
    </Button>
  );
};

export default SignOutButton;
