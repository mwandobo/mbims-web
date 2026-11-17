"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Download, FileDown, FileSpreadsheet, FileText, Loader2 } from "lucide-react";
import {ExportFormat} from "@/components/tables/utils/download-export.util";

interface Props {
    onExport: (format: ExportFormat) => Promise<void>;
    hint: string;
    disabled?: boolean;
}

const OPTIONS: { format: ExportFormat; label: string; icon: typeof FileText }[] = [
    { format: "csv", label: "CSV", icon: FileText },
    { format: "xlsx", label: "Excel (.xlsx)", icon: FileSpreadsheet },
    { format: "pdf", label: "PDF", icon: FileDown },
];

const ExportMenu = ({ onExport, hint, disabled }: Props) => {
    const [isOpen, setIsOpen] = useState(false);
    const [busy, setBusy] = useState<ExportFormat | null>(null);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const onMouseDown = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false);
        };
        const onKeyDown = (e: KeyboardEvent) => e.key === "Escape" && setIsOpen(false);
        document.addEventListener("mousedown", onMouseDown);
        document.addEventListener("keydown", onKeyDown);
        return () => {
            document.removeEventListener("mousedown", onMouseDown);
            document.removeEventListener("keydown", onKeyDown);
        };
    }, []);

    const handleSelect = async (format: ExportFormat) => {
        setBusy(format);
        try {
            await onExport(format);
            setIsOpen(false);
        } finally {
            setBusy(null);
        }
    };

    return (
        <div className="relative" ref={ref}>
            <button
                type="button"
                onClick={() => setIsOpen((p) => !p)}
                disabled={disabled || busy !== null}
                aria-haspopup="menu"
                aria-expanded={isOpen}
                className="flex items-center gap-1.5 rounded border border-card-border bg-card-bg px-3 py-2.5 text-sm text-foreground transition hover:bg-muted-bg disabled:cursor-not-allowed disabled:opacity-50"
            >
                {busy ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
                Export
                <ChevronDown size={14} className={`transition ${isOpen ? "rotate-180" : ""}`} />
            </button>

            {isOpen && (
                <div
                    role="menu"
                    className="absolute left-0 z-20 mt-2 w-56 overflow-hidden rounded-xl border border-card-border-light bg-card-bg p-1.5 text-foreground shadow-xl"
                >
                    <p className="px-2.5 pb-1 pt-1.5 text-[11px] text-muted">{hint}</p>
                    {OPTIONS.map(({ format, label, icon: Icon }) => (
                        <button
                            key={format}
                            role="menuitem"
                            disabled={busy !== null}
                            onClick={() => handleSelect(format)}
                            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm transition hover:bg-muted-bg disabled:opacity-50"
                        >
                            {busy === format ? <Loader2 size={15} className="animate-spin" /> : <Icon size={15} />}
                            {label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ExportMenu;