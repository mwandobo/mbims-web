"use client";

import ProtectedRoute from "@/components/authentication/protected-route";
import MuiCardComponent from "@/components/card/mui-card.component";
import ViewCardComponent from "@/components/card/view.card.component";
import PageHeader from "@/components/header/page-header";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getRequest } from "@/utils/api-calls.util";
import RequestedItems from "@/app/asset-management/asset-request/components/requested-items";

export default function AssetRequestShowPage({ assetId }: { assetId: string }) {
    const permission = "position";
    const router = useRouter();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const id = assetId;
    const url = `asset-requests/${id}`;
    const navigateToLogin = () => {
        return router.push("/login");
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            if (id) {
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
    }, []);

    return (
        <ProtectedRoute permission={`${permission}_read`} isLoading={loading}>
            <PageHeader
                links={[
                    {
                        name: "Category",
                        linkTo: "/asset-management/asset",
                        permission: "asset",
                        isClickable: true,
                    },
                    { name: "Show", linkTo: "/asset-management/asset/show", permission: "" },
                ]}
                isShowPage={true}
            />

            <MuiCardComponent>
                <ViewCardComponent
                    data={[
                        { label: "Request Name", value: data?.name },
                        { label: "Description", value: data?.description },
                    ]}
                    titleA="Asset Request"
                    titleB={data?.name}
                />
                <div className={'border border-gray-200 my-4'}>
                    <RequestedItems id={id} permission={permission} />
                </div>
            </MuiCardComponent>
        </ProtectedRoute>
    );
}
