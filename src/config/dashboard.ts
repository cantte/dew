import { type SidebarNavItem } from "~/types/nav";

type DashboardConfig = {
  mainNav: SidebarNavItem[];
};

export const dashboardConfig: DashboardConfig = {
  mainNav: [
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
          title: "Venta simple (Próximamente)",
          href: "/dashboard/sales/simple",
          disabled: true,
          items: [],
        },
        {
          title: "Listado (Próximamente)",
          href: "/dashboard/sales",
          disabled: true,
          items: [],
        },
      ],
    },
  ],
};
