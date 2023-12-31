import { type SidebarNavItem } from "~/types/nav";

type DashboardConfig = {
  mainNav: SidebarNavItem[];
};

export const dashboardConfig: DashboardConfig = {
  mainNav: [
    {
      title: "Panel de control",
      href: "/dashboard",
      items: [
        {
          title: "Inicio",
          href: "/dashboard",
          items: [],
        },
      ],
    },
    {
      title: "Productos",
      items: [
        {
          title: "Listado",
          href: "/dashboard/products",
          items: [],
        },
        {
          title: "Crear",
          href: "/products/create",
          items: [],
        },
      ],
    },
    {
      title: "Ventas",
      items: [
        {
          title: "Crear",
          href: "/sales/create",
          items: [],
        },
        {
          title: "Listado",
          href: "/dashboard/sales",
          items: [],
        },
      ],
    },
  ],
};
