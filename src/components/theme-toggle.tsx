"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-7 w-full justify-between gap-1"
        >
          <span className="ml-1 whitespace-nowrap text-xs">Cambiar tema</span>
          {theme === "light" ? (
            <Sun className="h-3 w-3" />
          ) : theme === "dark" ? (
            <Moon className="h-3 w-3" />
          ) : (
            <Monitor className="h-3 w-3" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          className="flex h-7 w-full justify-between gap-1"
          onClick={() => setTheme("light")}
        >
          <span>Claro</span>
          <Sun className="h-3 w-3" />
        </DropdownMenuItem>
        <DropdownMenuItem
          className="flex h-7 w-full justify-between gap-1"
          onClick={() => setTheme("dark")}
        >
          <span>Oscuro</span>
          <Moon className="h-3 w-3" />
        </DropdownMenuItem>
        <DropdownMenuItem
          className="flex h-7 w-full justify-between gap-1"
          onClick={() => setTheme("system")}
        >
          <span>Sistema</span>
          <Monitor className="h-3 w-3" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
