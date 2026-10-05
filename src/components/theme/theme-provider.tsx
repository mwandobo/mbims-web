"use client";

import { useEffect } from "react";

export default function ThemeProvider({
                                          children,
                                      }: {
    children: React.ReactNode;
}) {
    useEffect(() => {
        const theme = localStorage.getItem("theme") || "brand";
        const root = document.documentElement;

        root.classList.remove("light", "dark");
        if (theme === "light") root.classList.add("light");
        if (theme === "dark") root.classList.add("dark");
    }, []);

    return <>{children}</>;
}