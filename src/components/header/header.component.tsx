"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useGlobalContextHook } from "@/hooks/useGlobalContextHook";
import ProfileDropdown from "@/components/dropdown/profile-dropdown.component";
import NotificationComponent from "@/components/notification/notification-component";
import { Menu, X } from "lucide-react";
import {
    getValueFromLocalStorage,
    removeValueFromLocalStorage,
} from "@/utils/local-storage.util";

type Theme = "brand" | "light" | "dark";

const LOGO_BY_THEME: Record<Theme, string> = {
    brand: "/logo2.png",      // full color
    light: "/logo.png",     // dark logo for white header
    dark: "/logo.png",      // light logo for dark header
};

function getCurrentTheme(): Theme {
    if (typeof document === "undefined") return "brand";
    const root = document.documentElement;
    if (root.classList.contains("dark")) return "dark";
    if (root.classList.contains("light")) return "light";
    return "brand";
}

function Header() {
    const router = useRouter();
    const token = getValueFromLocalStorage("token") || "";
    const { state, dispatch } = useGlobalContextHook();
    const { currentUser, isSideBarHidden } = state;
    const [theme, setTheme] = useState<Theme>("brand");

    useEffect(() => {
        const userInfo = token
            ? JSON.parse(getValueFromLocalStorage("user"))
            : null;
        if (userInfo) {
            dispatch({ type: "SET_CURRENT_USER", payload: userInfo });
        }

        // initial theme
        setTheme(getCurrentTheme());

        // react when Settings (or anyone) changes the class on <html>
        const observer = new MutationObserver(() => {
            setTheme(getCurrentTheme());
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class"],
        });

        return () => observer.disconnect();
    }, []);

    const handleLogout = () => {
        try {
            removeValueFromLocalStorage("user");
            removeValueFromLocalStorage("token");
            router.push("/login");
        } catch (error) {
            console.error("Error during logout:", error);
        }
    };

    const toggleSideBar = () => {
        dispatch({
            type: "UPDATE_HIDE_SIDEBAR",
            payload: !isSideBarHidden,
        });
    };

    return (
        <nav className="w-full flex justify-between p-2 py-3 bg-header-bg text-header-text">
            <div className="flex items-center md:ps-8">
                <button onClick={toggleSideBar} className="me-3 md:hidden">
                    {isSideBarHidden ? (
                        <Menu size={32} strokeWidth={2} className="text-gray-400" />
                    ) : (
                        <X size={32} strokeWidth={2} />
                    )}
                </button>

                <img
                    src={LOGO_BY_THEME[theme]}
                    alt="logo"
                    className="h-10 w-auto"
                />
            </div>

            <div className="flex items-center justify-end gap-2 me-4">
                <NotificationComponent />
                <ProfileDropdown
                    name={currentUser?.email}
                    handleLogout={handleLogout}
                />
            </div>
        </nav>
    );
}

export default Header;