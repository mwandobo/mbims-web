import React, {useEffect, useMemo, useRef, useState} from "react";
import {Check, ChevronDown, Search} from "lucide-react";
import {createPortal} from "react-dom";

interface RoleOption {
    id: number;
    name: string;
}
const RoleSelect: React.FC<{
    value?: number;
    label?: string;
    options: RoleOption[];
    onChange: (roleId: number) => void;
    placeholder?: string;
}> = ({ value, label, options, onChange, placeholder = "Select role" }) => {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
    const rootRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const selected = options.find((o) => o.id === value);
    const display = selected?.name ?? label ?? "";

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return options;
        return options.filter((o) => o.name.toLowerCase().includes(q));
    }, [options, query]);

    const updatePosition = () => {
        const el = rootRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        setCoords({
            top: rect.bottom + 4,
            left: rect.left,
            width: rect.width,
        });
    };

    useEffect(() => {
        const onDocClick = (e: MouseEvent) => {
            if (!rootRef.current?.contains(e.target as Node)) {
                // also ignore clicks inside the portaled menu
                const menu = document.getElementById("role-select-menu");
                if (menu?.contains(e.target as Node)) return;
                setOpen(false);
                setQuery("");
            }
        };
        document.addEventListener("mousedown", onDocClick);
        return () => document.removeEventListener("mousedown", onDocClick);
    }, []);

    useEffect(() => {
        if (!open) return;
        updatePosition();
        setQuery("");
        setTimeout(() => inputRef.current?.focus(), 0);

        const onScrollOrResize = () => updatePosition();
        window.addEventListener("scroll", onScrollOrResize, true);
        window.addEventListener("resize", onScrollOrResize);
        return () => {
            window.removeEventListener("scroll", onScrollOrResize, true);
            window.removeEventListener("resize", onScrollOrResize);
        };
    }, [open]);

    return (
        <div ref={rootRef} className="relative min-w-0 flex-1">
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="flex w-full items-center justify-between gap-2 rounded-md border border-input bg-background px-2.5 py-1.5 text-left text-sm hover:bg-muted/40"
            >
                <span
                    className={`truncate ${
                        display ? "text-foreground" : "text-muted-foreground"
                    }`}
                >
                    {display || placeholder}
                </span>
                <ChevronDown size={14} className="shrink-0 text-muted-foreground" />
            </button>

            {open &&
                createPortal(
                    <div
                        id="role-select-menu"
                        style={{
                            position: "fixed",
                            top: coords.top,
                            left: coords.left,
                            width: coords.width,
                            zIndex: 9999, // above modal z-50
                        }}
                        className="overflow-hidden rounded-md border border-border bg-background shadow-lg"
                    >
                        <div className="flex items-center gap-2 border-b border-border px-2 py-1.5">
                            <Search size={13} className="shrink-0 text-muted-foreground" />
                            <input
                                ref={inputRef}
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search role..."
                                className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                            />
                        </div>
                        <ul className="max-h-48 overflow-y-auto py-1">
                            {filtered.length === 0 && (
                                <li className="px-3 py-2 text-xs text-muted-foreground">
                                    No roles found
                                </li>
                            )}
                            {filtered.map((role) => {
                                const isActive = role.id === value;
                                return (
                                    <li key={role.id}>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                onChange(role.id);
                                                setOpen(false);
                                                setQuery("");
                                            }}
                                            className={`flex w-full items-center justify-between gap-2 px-3 py-1.5 text-left text-sm hover:bg-muted ${
                                                isActive ? "bg-muted/60 font-medium" : ""
                                            }`}
                                        >
                                            <span className="truncate">{role.name}</span>
                                            {isActive && (
                                                <Check size={14} className="shrink-0 text-primary" />
                                            )}
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>,
                    document.body
                )}
        </div>
    );
};

export default RoleSelect;