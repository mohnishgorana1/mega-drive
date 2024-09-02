import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { FaGreaterThan } from "react-icons/fa6";
export default function BreadCrumb({ currentFolderId }: { currentFolderId: string | null }) {
    const [breadcrumb, setBreadcrumb] = useState([]);
    const router = useRouter();

    const fetchBreadcrumbPath = async (folderId: string) => {
        const path: any = [];

        // recursion
        while (folderId) {
            const response = await axios.post('/api/folder/get-breadCrumb-details', {
                folderId,
            });
            console.log("breadcrumb response", response);

            if (response?.status === 201) {
                const folder = response.data.folder;
                path.unshift({
                    name: folder.folderName,
                    id: folder._id,
                });
                folderId = folder.parentFolderId;
                console.log("path", path);
            } else {
                break;
            }
        }

        // Add the root folder (Home) at the beginning of the path
        path.unshift({ name: 'Home', id: '' });
        setBreadcrumb(path);
    };

    useEffect(() => {
        if (currentFolderId) {
            fetchBreadcrumbPath(currentFolderId);
        } else {
            setBreadcrumb([{ name: 'Home', id: '' }]);
        }
    }, [currentFolderId]);

    return (

        <nav className="md:w-[70%]">
            <ul className="flex flex-wrap">
                {breadcrumb.map((folder, index) => {
                    const isLastItem = index === breadcrumb.length - 1;
                    return (
                        <li key={index} className="">
                            {isLastItem ? (
                                <p className='flex px-2 pr-3 rounded-r-2xl items-center bg-[#396bbc]  font-bold'>
                                    {folder.name}
                                </p>
                            ) : (
                                <Link href={`/${folder.id}`} className='flex items-center'>
                                    <p
                                        className="px-2 pr-3 rounded-r-2xl bg-[#396bbc] text-white   hover:bg-[#17438b] font-bold"
                                    >{folder.name}
                                    </p>
                                    <span className="text-gray-400 mx-2 font-bold text-xs">
                                        <FaGreaterThan />
                                    </span>
                                </Link>
                            )}
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}
