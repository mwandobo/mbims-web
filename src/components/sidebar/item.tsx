
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
    const [hoverOpen, setHoverOpen] = useState(false);
    const pathName = usePathname();
    const { state, dispatch } = useGlobalContextHook();
    const collapsed = state.isSideBarHidden;

    const handleClick = (e: React.MouseEvent) => {
        if (items && items.length > 0) {
            e.preventDefault();
            if (collapsed) {
                // keep rail collapsed; flyout handles submenus on hover
                return;
            }
            setExpanded(!expanded);
        } else {
            if (path === "/project-management/project-planning") {
                setValueLocalStorage("selected_plan_item", "goal");
                setValueLocalStorage("selected_plan_item_id", null);
            }
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
        <div
            className="relative font-medium"
            style={{ fontSize: "13px" }}
            onMouseEnter={() => collapsed && setHoverOpen(true)}
            onMouseLeave={() => setHoverOpen(false)}
        >
            <Link
                href={items && items.length > 0 ? "#" : path}
                onClick={handleClick}
                className={`
                    flex items-center mb-1 rounded cursor-pointer hover:bg-sidebar-hover
                    ${isActive ? "bg-sidebar-active text-sidebar-text-active" : ""}
                    ${collapsed ? "justify-center gap-0.5 p-2" : "justify-between p-2"}
                `}
            >
                <div className={`flex items-center ${collapsed ? "" : "gap-2"}`}>
                    <Icon size={collapsed ? 22 : 13} />
                    {!collapsed && <p>{name}</p>}
                </div>

                {items && items.length > 0 && (
                    <ChevronDown
                        strokeWidth={3}
                        size={collapsed ? 12 : 14}
                        className={`
                            shrink-0
                            ${expanded && !collapsed ? "rotate-180 duration-200" : ""}
                            ${collapsed ? "opacity-70" : ""}
                        `}
                    />
                )}
            </Link>

            {/* Expanded sidebar: normal nested submenus */}
            {!collapsed && expanded && items && items.length > 0 && (
                <div className="flex flex-col ml-4">
                    {items.map(
                        (sub) =>
                            checkPermissions(sub?.permission) && (
                                <SubMenuItem key={sub.path} item={sub} />
                            )
                    )}
                </div>
            )}

            {/* Collapsed: flyout panel (mini sidebar for this item only) */}
            {collapsed && hoverOpen && (
                <div
                    className="
                        absolute left-full top-0 z-50 ml-1 min-w-[180px]
                        rounded-md border border-sidebar-border
                        bg-sidebar-bg text-sidebar-text shadow-lg
                        py-1 px-1
                    "
                >
                    {/* Parent label */}
                    <div className="px-3 py-2 text-xs font-semibold border-b border-sidebar-border mb-1">
                        {name}
                    </div>

                    {/* Leaf item: clickable link */}
                    {(!items || items.length === 0) && (
                        <Link
                            href={path}
                            className={`
                                block rounded px-3 py-2 hover:bg-sidebar-hover
                                ${isActive ? "bg-sidebar-active text-sidebar-text-active" : ""}
                            `}
                            onClick={() => setHoverOpen(false)}
                        >
                            {name}
                        </Link>
                    )}

                    {/* Parent with children: list submenus */}
                    {items &&
                        items.length > 0 &&
                        items.map(
                            (sub) =>
                                checkPermissions(sub?.permission) && (
                                    <div key={sub.path} onClick={() => setHoverOpen(false)}>
                                        <SubMenuItem item={sub} />
                                    </div>
                                )
                        )}
                </div>
            )}
        </div>
    );
}

export default SidebarItem;