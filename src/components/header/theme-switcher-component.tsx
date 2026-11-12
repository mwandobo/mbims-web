"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Check, Moon, Palette, Sun, type LucideIcon } from "lucide-react";

type Theme = "brand" | "light" | "dark";

// Change this if your Settings page stores the theme under a different key
const STORAGE_KEY = "theme";

const THEMES: { value: Theme; label: string; description: string; icon: LucideIcon }[] = [
    { value: "brand", label: "Brand", description: "Default company colors", icon: Palette },
    { value: "light", label: "Light", description: "Bright and clean", icon: Sun },
    { value: "dark", label: "Dark", description: "Easy on the eyes", icon: Moon },
];

const readThemeFromDom = (): Theme => {
    const root = document.documentElement;
    if (root.classList.contains("dark")) return "dark";
    if (root.classList.contains("light")) return "light";
    return "brand";
};

const applyTheme = (theme: Theme) => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    if (theme !== "brand") root.classList.add(theme);
};

const ThemeSwitcherComponent = () => {
    const [theme, setTheme] = useState<Theme>("brand");
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Initial theme: saved preference first, otherwise whatever is on <html>
    useEffect(() => {
        let saved: Theme | null = null;
        try {
            const value = localStorage.getItem(STORAGE_KEY);
            if (value === "brand" || value === "light" || value === "dark") saved = value;
        } catch {
            /* storage unavailable */
        }

        if (saved) {
            applyTheme(saved);
            setTheme(saved);
        } else {
            setTheme(readThemeFromDom());
        }

        // Stay in sync if something else (e.g. the Settings page) changes the class
        const observer = new MutationObserver(() => setTheme(readThemeFromDom()));
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class"],
        });
        return () => observer.disconnect();
    }, []);

    // Close on outside click or Escape
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") setIsOpen(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    const selectTheme = useCallback((next: Theme) => {
        applyTheme(next);
        setTheme(next);
        try {
            localStorage.setItem(STORAGE_KEY, next);
        } catch {
            /* storage unavailable */
        }
        setIsOpen(false);
    }, []);

    const current = THEMES.find((t) => t.value === theme) ?? THEMES[0];
    const CurrentIcon = current.icon;

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen((prev) => !prev)}
                aria-haspopup="menu"
                aria-expanded={isOpen}
                aria-label={`Change theme (current: ${current.label})`}
                title={`Theme: ${current.label}`}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-header-text/15 text-header-text ring-2 ring-transparent transition hover:ring-header-text/40 focus:outline-none focus-visible:ring-header-text/60 md:h-8 md:w-8"
            >
                <CurrentIcon className="h-[18px] w-[18px] md:h-4 md:w-4" />
            </button>

            {isOpen && (
                <div
                    role="menu"
                    aria-label="Select theme"
                    className="absolute right-0 z-30 mt-2 w-56 overflow-hidden rounded-xl border border-card-border-light bg-card-bg p-1.5 text-foreground shadow-xl"
                >
                    <p className="px-2.5 pb-1 pt-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted">
                        Theme
                    </p>
                    {THEMES.map(({ value, label, description, icon: Icon }) => {
                        const active = theme === value;
                        return (
                            <button
                                key={value}
                                role="menuitemradio"
                                aria-checked={active}
                                onClick={() => selectTheme(value)}
                                className={`flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left transition hover:bg-muted-bg focus:outline-none focus-visible:bg-muted-bg ${
                                    active ? "bg-muted-bg" : ""
                                }`}
                            >
                                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-card-border-light">
                                    <Icon size={15} />
                                </span>
                                <span className="min-w-0 flex-1">
                                    <span className="block text-sm font-medium leading-tight">{label}</span>
                                    <span className="block truncate text-xs text-muted">{description}</span>
                                </span>
                                {active && <Check size={16} className="shrink-0 text-primary" />}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default ThemeSwitcherComponent;