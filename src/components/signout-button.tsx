"use client";

import { signOut } from "next-auth/react";
import { Button } from "~/components/ui/button";

type Props = {
  className?: string;
};

const SignOutButton = () => {
  return (
    <Button variant="ghost" size="sm" onClick={() => void signOut()}>
      Cerrar sesión
    </Button>
  );
};

export default SignOutButton;
