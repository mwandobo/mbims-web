"use client";

import ProtectedRoute from "@/components/authentication/protected-route";
import PageHeader from "@/components/header/page-header";
import React, { useEffect, useState } from "react";
import { ButtonComponent } from "@/components/button/button.component";
import { Moon, Sun, Palette } from "lucide-react";

type Theme = "brand" | "light" | "dark";

function applyTheme(theme: Theme) {
    const root = document.documentElement;
    root.classList.remove("light", "dark");

    if (theme === "light") root.classList.add("light");
    if (theme === "dark") root.classList.add("dark");
    // brand → no class (uses :root)

    localStorage.setItem("theme", theme);
}

function Settings() {
    const [theme, setTheme] = useState<Theme>("brand");

    useEffect(() => {
        const saved = (localStorage.getItem("theme") as Theme) || "brand";
        setTheme(saved);
        applyTheme(saved);
    }, []);

    const selectTheme = (next: Theme) => {
        setTheme(next);
        applyTheme(next);
    };

    return (
        <ProtectedRoute isLoading={false}>
            <PageHeader
                handleClick={() => {}}
                links={[{ name: "Settings ", linkTo: "/Settings", permission: "" }]}
                isHideAdd={true}
            />

            <div className="mt-4 flex flex-wrap gap-3">
                <ButtonComponent
                    name="Brand"
                    rounded="md"
                    padding="p-3"
                    onClick={() => selectTheme("brand")}
                    shadow="shadow-md"
                    bg_color={theme === "brand" ? "bg-primary" : "bg-gray-50"}
                    hover="hover:bg-gray-200 hover:border-gray-400"
                    hover_text="hover:text-gray-900 hover:font-semibold"
                    border="border border-gray-300"
                    text_color={theme === "brand" ? "text-white" : "text-gray-700"}
                >
                    <Palette size={13} />
                </ButtonComponent>

                <ButtonComponent
                    name="Light"
                    rounded="md"
                    padding="p-3"
                    onClick={() => selectTheme("light")}
                    shadow="shadow-md"
                    bg_color={theme === "light" ? "bg-primary" : "bg-gray-50"}
                    hover="hover:bg-gray-200 hover:border-gray-400"
                    hover_text="hover:text-gray-900 hover:font-semibold"
                    border="border border-gray-300"
                    text_color={theme === "light" ? "text-white" : "text-gray-700"}
                >
                    <Sun size={13} />
                </ButtonComponent>

                <ButtonComponent
                    name="Dark"
                    rounded="md"
                    padding="p-3"
                    onClick={() => selectTheme("dark")}
                    shadow="shadow-md"
                    bg_color={theme === "dark" ? "bg-primary" : "bg-gray-50"}
                    hover="hover:bg-gray-200 hover:border-gray-400"
                    hover_text="hover:text-gray-900 hover:font-semibold"
                    border="border border-gray-300"
                    text_color={theme === "dark" ? "text-white" : "text-gray-700"}
                >
                    <Moon size={13} />
                </ButtonComponent>
            </div>
        </ProtectedRoute>
    );
}

export default Settings;