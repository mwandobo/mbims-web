"use client";

import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
    AlertCircle,
    CheckCircle2,
    FileSpreadsheet,
    Loader2,
    Upload,
    X,
} from "lucide-react";
import ToastComponent from "@/components/popup/toast";
import {
    ImportResult,
    downloadImportTemplate,
    runImport,
} from "@/components/tables/utils/import-data.util";

interface Props {
    importKey: string;
    onImported?: () => void;
}

type Phase = "idle" | "checking" | "ready" | "importing";

const MAX_ERRORS_SHOWN = 100;

const ImportDialog = ({ importKey, onImported }: Props) => {
    const [isOpen, setIsOpen] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [phase, setPhase] = useState<Phase>("idle");
    const [result, setResult] = useState<ImportResult | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [dragging, setDragging] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const reset = () => {
        setFile(null);
        setPhase("idle");
        setResult(null);
        setMessage(null);
        setDragging(false);
        if (inputRef.current) inputRef.current.value = "";
    };

    const close = () => {
        if (phase === "checking" || phase === "importing") return;
        setIsOpen(false);
        reset();
    };

    // Picking a file immediately runs a dry run (nothing is saved)
    const handleFile = async (picked: File | null | undefined) => {
        if (!picked) return;

        if (!/\.(csv|xlsx)$/i.test(picked.name)) {
            setFile(null);
            setResult(null);
            setMessage("Unsupported file type. Upload a .csv or .xlsx file.");
            return;
        }

        setFile(picked);
        setResult(null);
        setMessage(null);
        setPhase("checking");
        try {
            setResult(await runImport(importKey, picked, true));
        } catch (e: any) {
            setMessage(e.message);
        } finally {
            setPhase("ready");
        }
    };

    const handleImport = async () => {
        if (!file) return;
        setPhase("importing");
        setMessage(null);
        try {
            const res = await runImport(importKey, file, false);
            if (res.errors.length === 0) {
                ToastComponent({ text: `${res.imported} records imported successfully` });
                setIsOpen(false);
                reset();
                onImported?.();
                return;
            }
            setResult(res); // save-time failure: show it, nothing was imported
        } catch (e: any) {
            setMessage(e.message);
        }
        setPhase("ready");
    };

    const handleTemplate = async (format: "xlsx" | "csv") => {
        try {
            await downloadImportTemplate(importKey, format);
        } catch (e: any) {
            ToastComponent({ type: "error", text: e.message });
        }
    };

    const hasErrors = !!result && result.errors.length > 0;
    const canImport = !!result && !hasErrors && !message && phase === "ready";
    const busy = phase === "checking" || phase === "importing";

    return (
        <>
            <button
                type="button"
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-1.5 rounded border border-card-border bg-card-bg px-3 py-2.5 text-sm text-foreground transition hover:bg-muted-bg"
            >
                <Upload size={14} />
                Import
            </button>

            {isOpen &&
                createPortal(
                    <div
                        className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 p-4"
                        onMouseDown={(e) => e.target === e.currentTarget && close()}
                    >
                        <div
                            role="dialog"
                            aria-modal="true"
                            aria-label="Import data"
                            className="flex max-h-[90vh] w-full max-w-xl flex-col overflow-hidden rounded-xl border border-card-border-light bg-card-bg text-foreground shadow-xl"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between border-b border-card-border-light px-5 py-4">
                                <h3 className="text-sm font-semibold">Import data</h3>
                                <button
                                    onClick={close}
                                    disabled={busy}
                                    aria-label="Close"
                                    className="rounded-md p-1 transition hover:bg-muted-bg disabled:opacity-40"
                                >
                                    <X size={16} />
                                </button>
                            </div>

                            <div className="space-y-4 overflow-y-auto px-5 py-4">
                                {/* Template */}
                                <p className="text-xs text-muted">
                                    Use the template so the column headers match. Download:{" "}
                                    <button onClick={() => handleTemplate("xlsx")} className="text-primary hover:underline">
                                        Excel
                                    </button>{" "}
                                    or{" "}
                                    <button onClick={() => handleTemplate("csv")} className="text-primary hover:underline">
                                        CSV
                                    </button>
                                </p>

                                {/* Dropzone */}
                                <div
                                    onDragOver={(e) => {
                                        e.preventDefault();
                                        setDragging(true);
                                    }}
                                    onDragLeave={() => setDragging(false)}
                                    onDrop={(e) => {
                                        e.preventDefault();
                                        setDragging(false);
                                        if (!busy) handleFile(e.dataTransfer.files?.[0]);
                                    }}
                                    onClick={() => !busy && inputRef.current?.click()}
                                    className={`flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed px-4 py-8 text-center transition ${
                                        dragging ? "border-primary bg-muted-bg" : "border-card-border hover:bg-muted-bg"
                                    } ${busy ? "cursor-not-allowed opacity-60" : ""}`}
                                >
                                    <FileSpreadsheet size={28} className="text-muted" />
                                    {file ? (
                                        <p className="text-sm font-medium">{file.name}</p>
                                    ) : (
                                        <p className="text-sm font-medium">Drop a file here or click to browse</p>
                                    )}
                                    <p className="text-xs text-muted">.csv or .xlsx, up to 5 MB</p>
                                    <input
                                        ref={inputRef}
                                        type="file"
                                        accept=".csv,.xlsx"
                                        className="hidden"
                                        onChange={(e) => handleFile(e.target.files?.[0])}
                                    />
                                </div>

                                {/* Status */}
                                {phase === "checking" && (
                                    <p className="flex items-center gap-2 text-sm text-muted">
                                        <Loader2 size={16} className="animate-spin" /> Checking file...
                                    </p>
                                )}

                                {message && (
                                    <p className="flex items-start gap-2 rounded-md bg-muted-bg px-3 py-2 text-sm text-error">
                                        <AlertCircle size={16} className="mt-0.5 shrink-0" />
                                        {message}
                                    </p>
                                )}

                                {canImport && result && (
                                    <p className="flex items-center gap-2 rounded-md bg-muted-bg px-3 py-2 text-sm">
                                        <CheckCircle2 size={16} className="shrink-0 text-primary" />
                                        {result.totalRows} {result.totalRows === 1 ? "row is" : "rows are"} valid and ready to import.
                                    </p>
                                )}

                                {hasErrors && result && (
                                    <div>
                                        <p className="mb-2 flex items-center gap-2 text-sm font-medium text-error">
                                            <AlertCircle size={16} />
                                            {result.errors.length} {result.errors.length === 1 ? "problem" : "problems"} found. Nothing was imported.
                                        </p>
                                        <div className="max-h-56 overflow-auto rounded-md border border-card-border-light">
                                            <table className="w-full text-left text-xs">
                                                <thead className="sticky top-0 bg-muted-bg">
                                                <tr>
                                                    <th className="px-3 py-2 font-semibold">Row</th>
                                                    <th className="px-3 py-2 font-semibold">Column</th>
                                                    <th className="px-3 py-2 font-semibold">Problem</th>
                                                </tr>
                                                </thead>
                                                <tbody className="divide-y divide-card-border-light">
                                                {result.errors.slice(0, MAX_ERRORS_SHOWN).map((err, i) => (
                                                    <tr key={i}>
                                                        <td className="px-3 py-1.5">{err.row}</td>
                                                        <td className="px-3 py-1.5">{err.column ?? "-"}</td>
                                                        <td className="px-3 py-1.5">{err.message}</td>
                                                    </tr>
                                                ))}
                                                </tbody>
                                            </table>
                                        </div>
                                        {result.errors.length > MAX_ERRORS_SHOWN && (
                                            <p className="mt-1 text-[11px] text-muted">
                                                Showing the first {MAX_ERRORS_SHOWN}. Fix these and upload again to see the rest.
                                            </p>
                                        )}
                                        <p className="mt-2 text-[11px] text-muted">
                                            Row numbers match the rows in your spreadsheet (the header is row 1).
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="flex justify-end gap-2 border-t border-card-border-light px-5 py-3">
                                <button
                                    onClick={close}
                                    disabled={busy}
                                    className="rounded-md px-3 py-2 text-sm transition hover:bg-muted-bg disabled:opacity-40"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleImport}
                                    disabled={!canImport}
                                    className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    {phase === "importing" && <Loader2 size={14} className="animate-spin" />}
                                    {phase === "importing"
                                        ? "Importing..."
                                        : canImport && result
                                            ? `Import ${result.totalRows} rows`
                                            : "Import"}
                                </button>
                            </div>
                        </div>
                    </div>,
                    document.body
                )}
        </>
    );
};

export default ImportDialog;