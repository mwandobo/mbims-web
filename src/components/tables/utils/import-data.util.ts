import { getBlobRequest, postRequest } from "@/utils/api-calls.util";

export interface ImportRowError {
    row: number;
    column: string | null;
    message: string;
}

export interface ImportResult {
    dryRun: boolean;
    totalRows: number;
    imported: number;
    errors: ImportRowError[];
}

/**
 * Runs an import. Row-level failures come back as 422 with an `errors` list:
 * those are returned as a normal result. Anything else (wrong file type,
 * missing columns, too many rows, network) throws an Error with a readable message.
 */
export const runImport = async (importKey: string, file: File, dryRun: boolean): Promise<ImportResult> => {
    const form = new FormData();
    form.append("file", file);

    try {
        const res = await postRequest<ImportResult>(`imports/${importKey}?dryRun=${dryRun}`, form, true);
        return res.data;
    } catch (err: any) {
        const data = err?.response?.data;
        if (err?.response?.status === 422 && Array.isArray(data?.errors)) {
            return data as ImportResult;
        }
        if (err?.code === "ERR_NETWORK") throw new Error("Network error. Please check your connection.");
        throw new Error(data?.message ?? "Import failed. Please try again.");
    }
};

export const downloadImportTemplate = async (importKey: string, format: "xlsx" | "csv") => {
    let blob: Blob;
    try {
        const res = await getBlobRequest(`imports/${importKey}/template?format=${format}`);
        blob = res.data;
    } catch {
        throw new Error("Could not download the template.");
    }

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${importKey}-template.${format}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
};