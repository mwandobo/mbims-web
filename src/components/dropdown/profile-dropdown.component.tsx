"use client";

import { useState, useRef, useEffect } from "react";
import { LogOut, Mail, ShieldCheck, User } from "lucide-react";

interface ProfileUser {
    name?: string;
    email?: string;
    roleName?: string;
}

interface Props {
    user?: ProfileUser | null;
    handleLogout: () => void;
}

const getInitials = (name?: string, email?: string) => {
    const source = (name || email || "?").trim();
    const parts = source.split(/[\s@.]+/).filter(Boolean);
    return ((parts[0]?.[0] ?? "?") + (parts[1]?.[0] ?? "")).toUpperCase();
};

const ProfileDropdown = ({ user, handleLogout }: Props) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const { name, email, roleName } = user ?? {};
    const initials = getInitials(name, email);

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

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Avatar trigger + hover tooltip */}
            <div className="group relative">
                <button
                    onClick={() => setIsOpen((prev) => !prev)}
                    aria-haspopup="menu"
                    aria-expanded={isOpen}
                    aria-label="Open profile menu"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-header-text/15 text-sm font-semibold text-header-text ring-2 ring-transparent transition hover:ring-header-text/40 focus:outline-none focus-visible:ring-header-text/60 md:h-8 md:w-8 md:text-xs"
                >
                    {initials}
                </button>

                {/* Tooltip: only when closed */}
                {!isOpen && email && (
                    <div
                        role="tooltip"
                        className="pointer-events-none absolute right-0 top-full z-20 mt-2 whitespace-nowrap rounded-md bg-foreground px-2.5 py-1 text-xs text-card-bg opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100"
                    >
                        {email}
                    </div>
                )}
            </div>

            {/* Profile panel */}
            {isOpen && (
                <div
                    role="menu"
                    className="absolute right-0 z-30 mt-2 w-64 overflow-hidden rounded-xl border border-card-border-light bg-card-bg text-foreground shadow-xl"
                >
                    {/* Header */}
                    <div className="flex items-center gap-3 border-b border-card-border-light px-4 py-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-muted-bg text-base font-semibold">
                            {initials}
                        </div>
                        <div className="min-w-0">
                            <p className="truncate text-sm font-semibold">{name || "Unnamed user"}</p>
                            {roleName && (
                                <span className="mt-0.5 inline-block rounded-full bg-muted-bg px-2 py-0.5 text-[11px] font-medium capitalize">
                                    {roleName}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Details */}
                    <dl className="space-y-3 px-4 py-3 text-sm">
                        <div className="flex items-center gap-2">
                            <Mail size={14} className="shrink-0 opacity-60" />
                            <dd className="truncate">{email || "—"}</dd>
                        </div>
                        <div className="flex items-center gap-2">
                            <User size={14} className="shrink-0 opacity-60" />
                            <dd className="truncate">{name || "—"}</dd>
                        </div>
                        <div className="flex items-center gap-2">
                            <ShieldCheck size={14} className="shrink-0 opacity-60" />
                            <dd className="truncate capitalize">{roleName || "—"}</dd>
                        </div>
                    </dl>

                    {/* Logout */}
                    <div className="border-t border-card-border-light p-2">
                        <button
                            role="menuitem"
                            onClick={() => {
                                setIsOpen(false);
                                handleLogout();
                            }}
                            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-red-600 transition hover:bg-muted-bg"
                        >
                            <LogOut size={14} />
                            Logout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileDropdown;