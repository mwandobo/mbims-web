// hooks/use-entity-show.hook.ts
"use client";

import { useCallback, useEffect, useState } from "react";
import { getRequest } from "@/utils/api-calls.util";
import Swal from "sweetalert2";

export function usePageShow<T = any>(url?: string | null) {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [refreshKey, setRefreshKey] = useState(0);

    const refresh = useCallback(() => {
        setRefreshKey((k) => k + 1);
    }, []);

    useEffect(() => {
        if (!url) return;

        let cancelled = false;

        const fetchData = async () => {
            setLoading(true);
            setError(null);

            try {
                const res = await getRequest(url);

                if (cancelled) return;

                if (res?.status === 200) {
                    setData(res.data as T);
                } else {
                    throw new Error((res as any)?.data?.message || "Failed to load data");
                }
            } catch (err: any) {
                if (cancelled) return;

                const message =
                    err?.response?.data?.message ||
                    err?.message ||
                    (err?.code === "ERR_NETWORK"
                        ? "Network error. Please check your connection."
                        : "Something went wrong");

                setError(message);
                setData(null);

                // Same style as your table / form errors — no redirect to login
                if (!Swal.isVisible()) {
                    Swal.fire({
                        title: "Error",
                        text: message,
                        icon: "error",
                    });
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        fetchData();

        return () => {
            cancelled = true;
        };
    }, [url, refreshKey]);

    return { data, loading, error, refresh, setData };
}