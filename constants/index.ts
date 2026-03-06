import { 
    MdOutlineFolderOpen, 
    MdOutlineDelete, 
    MdOutlineStarBorder 
} from "react-icons/md";

export const navLinks = [
    {
        route: "/",
        label: "All Files",
        icon: MdOutlineFolderOpen,
    },
    {
        route: "/favourites",
        label: "Favourites",
        icon: MdOutlineStarBorder,
    }, 
    {
        route: "/trash",
        label: "Trash",
        icon: MdOutlineDelete,
    }, 
];