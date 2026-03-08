import { Globe, LayoutDashboard, Star, Trash2 } from "lucide-react";

export const navLinks = [
  {
    route: "/dashboard",
    label: "My Drive",
    icon: LayoutDashboard,
  },
  {
    route: "/dashboard/favourites",
    label: "Favourites",
    icon: Star,
  },
  {
    route: "/dashboard/shared",
    label: "Shared Links",
    icon: Globe,
  },
  {
    route: "/dashboard/trash",
    label: "Trash",
    icon: Trash2,
  },
];
