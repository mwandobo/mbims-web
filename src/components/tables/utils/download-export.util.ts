import { getBlobRequest } from "@/utils/api-calls.util";

export type ExportFormat = "csv" | "xlsx" | "pdf";

interface DownloadParams {
    exportKey: string;
    format: ExportFormat;
    filterKey?: string;
    sortBy?: string;
    sortDirection?: "asc" | "desc";
}

// With responseType "blob", error bodies also arrive as a Blob, so read the message out of it
const extractErrorMessage = async (err: any): Promise<string> => {
    const data = err?.response?.data;
    if (data instanceof Blob) {
        try {
            const parsed = JSON.parse(await data.text());
            if (parsed?.message) return parsed.message;
        } catch {
            /* not JSON */
        }
    } else if (data?.message) {
        return data.message;
    }
    if (err?.code === "ERR_NETWORK") return "Network error. Please check your connection.";
    return "Export failed. Please try again.";
};

export const downloadExport = async ({
                                         exportKey,
                                         format,
                                         filterKey,
                                         sortBy,
                                         sortDirection,
                                     }: DownloadParams) => {
    const params = new URLSearchParams();
    if (filterKey) params.set("filterKey", filterKey);
    if (sortBy) params.set("sortBy", sortBy);
    if (sortDirection) params.set("sortDirection", sortDirection);

    const query = params.toString();
    const url = `exports/${exportKey}/${format}${query ? `?${query}` : ""}`;

    let blob: Blob;
    try {
        const res = await getBlobRequest(url);
        blob = res.data;
    } catch (err: any) {
        throw new Error(await extractErrorMessage(err));
    }

    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = `${exportKey}-${new Date().toISOString().slice(0, 10)}.${format}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
};