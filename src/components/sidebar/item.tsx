"use client";

import { ChevronDown, LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useMemo, useState } from "react";
import SubMenuItem from "./submenu-item";
import { useGlobalContextHook } from "@/hooks/useGlobalContextHook";
import { setValueLocalStorage } from "@/utils/local-storage.util";
import { checkPermissions } from "@/utils/check-permissions";

interface ISidebarItem {
    name: string;
    path: string;
    icon: LucideIcon;
    items?: ISubItem[];
    group?: string;
    permission?: string;
}

interface ISubItem {
    name: string;
    path: string;
    icon: LucideIcon;
    group?: string;
    permission?: string;
}

function SidebarItem({ item }: { item: ISidebarItem }) {
    const { name, icon: Icon, items, path } = item;
    const [expanded, setExpanded] = useState(false);
    const pathName = usePathname();
    const { dispatch } = useGlobalContextHook();

    const handleClick = (e: React.MouseEvent) => {
        // For expandable items
        if (items && items.length > 0) {
            e.preventDefault();
            setExpanded(!expanded);
        } else {
            // Custom logic for certain routes
            if (path === "/project-management/project-planning") {
                setValueLocalStorage("selected_plan_item", "goal");
                setValueLocalStorage("selected_plan_item_id", null);
            }

            // Hide sidebar on mobile
            if (typeof window !== "undefined" && window.innerWidth < 768) {
                dispatch({ type: "UPDATE_HIDE_SIDEBAR", payload: true });
            }
        }
    };

    const isActive = useMemo(() => {
        if (items && items.length > 0) {
            if (items.find((sub) => sub.path === pathName)) {
                setExpanded(true);
                return true;
            }
        }
        return path === pathName;
    }, [path, pathName, items]);

    return (
        <div className="text-gray-700 font-medium" style={{ fontSize: "13px" }}>
            <Link
                href={items && items.length > 0 ? "#" : path}
                onClick={handleClick}
                className={`flex items-center mb-1 justify-between p-2 rounded cursor-pointer hover:bg-gray-200 ${
                    isActive ? "bg-gray-200" : ""
                }`}
            >
                <div className="flex items-center gap-2">
                    <Icon size={13} />
                    <p>{name}</p>
                </div>

                {items && items.length > 0 && (
                    <ChevronDown
                        strokeWidth={3}
                        size={14}
                        className={expanded ? "rotate-180 duration-200" : ""}
                    />
                )}
            </Link>

            {expanded && items && items.length > 0 && (
                <div className="flex flex-col ml-4">
                    {items.map(
                        (sub) =>
                            checkPermissions(sub?.permission) && (
                                <SubMenuItem key={sub.path} item={sub} />
                            )
                    )}
                </div>
            )}
        </div>
    );
}

export default SidebarItem;
