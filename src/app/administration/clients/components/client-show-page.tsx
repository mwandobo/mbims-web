// src/components/ClientShowPage.tsx
"use client"

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/authentication/protected-route";
import MuiCardComponent from "@/components/card/mui-card.component";
import ViewCardComponent from "@/components/card/view.card.component";
import PageHeader from "@/components/header/page-header";
import { getRequest } from "@/utils/api-calls.util";

export default function ClientShowPage({ clientId }: { clientId: string }) {
    const router = useRouter();
    const [data, setData] = useState<any>([]);
    const [loading, setLoading] = useState(false);

    const url = `clients/${clientId}`;
    const navigateToLogin = () => router.push("/login");

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            if (clientId) {
                try {
                    const res = await getRequest(url);
                    if (res && res.status === 200) {
                        setData(res.data);
                    }
                } catch (error: any) {
                    if (error?.code === "ERR_NETWORK") {
                        navigateToLogin();
                    }
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchData();
    }, [clientId]);

    return (
        <ProtectedRoute>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <>
                    <PageHeader
                        links={[
                            { name: "Clients", linkTo: "/administration/suppliers", permission: "client", isClickable: true },
                            { name: "Show", linkTo: "/administration/suppliers/show", permission: "" },
                        ]}
                        isShowPage={true}
                    />
                    <MuiCardComponent>
                        <ViewCardComponent
                            data={[
                                { label: "Client Name", value: data.name },
                                { label: "Phone", value: data?.phone },
                                { label: "Email", value: data?.email },
                            ]}
                            titleA="Client"
                            titleB={data.name}
                        />
                    </MuiCardComponent>
                </>
            )}
        </ProtectedRoute>
    );
}
