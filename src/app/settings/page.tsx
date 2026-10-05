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
                >
                    <Palette size={13} />
                </ButtonComponent>

                <ButtonComponent
                    name="Light"
                    rounded="md"
                    padding="p-3"
                    onClick={() => selectTheme("light")}
                >
                    <Sun size={13} />
                </ButtonComponent>

                <ButtonComponent
                    name="Dark"
                    rounded="md"
                    padding="p-3"
                    onClick={() => selectTheme("dark")}
                >
                    <Moon size={13} />
                </ButtonComponent>
            </div>
        </ProtectedRoute>
    );
}

export default Settings;