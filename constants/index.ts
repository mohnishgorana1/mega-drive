import { HardDrive } from "lucide-react";
import { 
    MdOutlineFolderOpen, 
    MdOutlineDelete, 
    MdOutlineStarBorder 
} from "react-icons/md";

export const navLinks = [
    {
        route: "/dashboard",
        label: "My Drive",
        icon: HardDrive,
    },
    {
        route: "/dashboard/favourites",
        label: "Favourites",
        icon: MdOutlineStarBorder,
    }, 
    {
        route: "/dashboard/trash",
        label: "Trash",
        icon: MdOutlineDelete,
    }, 
];