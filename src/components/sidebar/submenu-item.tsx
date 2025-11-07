"use client";

import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useMemo } from "react";
import { useGlobalContextHook } from "@/hooks/useGlobalContextHook";
import { setValueLocalStorage } from "@/utils/local-storage.util";

interface ISubItem {
    name: string;
    path: string;
    icon: LucideIcon;
    group?: string;
}

function SubMenuItem({ item }: { item: ISubItem }) {
    const { name, icon: Icon, path, group } = item;
    const pathName = usePathname();
    const { dispatch } = useGlobalContextHook();

    const handleClick = (e: React.MouseEvent) => {
        // Store group if available
        if (group && path !== pathName) {
            setValueLocalStorage("group", group);
        }

        // Hide sidebar on mobile
        if (typeof window !== "undefined" && window.innerWidth < 768) {
            dispatch({ type: "UPDATE_HIDE_SIDEBAR", payload: true });
        }
    };

    const isActive = useMemo(() => path === pathName, [path, pathName]);

    return (
        <Link
            href={path}
            onClick={handleClick}
            className={`flex items-center justify-between py-1 ps-2 rounded cursor-pointer mb-1 hover:bg-gray-200 ${
                isActive ? "bg-gray-200" : ""
            }`}
        >
            <div className="flex items-center space-x-2">
                <Icon size={13} />
                <p>{name}</p>
            </div>
        </Link>
    );
}

export default SubMenuItem;
