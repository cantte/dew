import {
  Coins,
  Home,
  ShoppingBasket,
  ShoppingCart,
  Store,
  Users,
  Box,
} from "lucide-react";
import React from "react";
import { type SidebarNavItem } from "~/types/nav";

type DashboardConfig = {
  mainNav: SidebarNavItem[];
};

export const dashboardConfig: DashboardConfig = {
  mainNav: [
    {
      title: "Panel de control",
      href: "/dashboard",
      icon: <Home className="h-4 w-4" />,
    },
    {
      title: "Productos",
      href: "/dashboard/products",
      icon: <ShoppingBasket className="h-4 w-4" />,
    },
    {
      title: "Inventario",
      href: "/dashboard/inventory",
      icon: <Box className="h-4 w-4" />,
    },
    {
      title: "Ventas",
      href: "/dashboard/sales",
      icon: <ShoppingCart className="h-4 w-4" />,
    },
    {
      title: "Caja registradora",
      href: "/dashboard/cash",
      icon: <Coins className="h-4 w-4" />,
    },
    {
      title: "Tiendas",
      href: "/dashboard/stores",
      icon: <Store className="h-4 w-4" />,
    },
    {
      title: "Empleados",
      href: "/dashboard/employees",
      icon: <Users className="h-4 w-4" />,
    },
  ],
};
