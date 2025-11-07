"use client"

import ProtectedRoute from "@/components/authentication/protected-route";
import MuiCardComponent from "@/components/card/mui-card.component";
import ViewCardComponent from "@/components/card/view.card.component";
import PageHeader from "@/components/header/page-header";
import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import {getRequest} from "@/utils/api-calls.util";
import {Check, CheckCircle2, X} from "lucide-react";

export default function AssetShowPage({assetId}: { assetId: string }) {
    const permission = 'position'
    const router = useRouter()
    const [data, setData] = useState<any>([])
    const [loading, setLoading] = useState(false)

    const id = assetId

    const url = `assets/${id}`
    const navigateToLogin = () => {
        return router.push('/login')
    }

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            if (id) {
                try {
                    setLoading(true)
                    const res = await getRequest(url)

                    if (data && res.status === 200) {
                        setData(res.data)
                        setLoading(false)
                    }

                } catch (error: any) {
                    if (error?.code === "ERR_NETWORK") {
                        navigateToLogin()
                    }
                }
            }
        };
        fetchData()
    }, [])


    return (

        <ProtectedRoute
            permission={`${permission}_read`}
            isLoading={loading}
        >
            <PageHeader
                links={[
                    {name: 'Asset Management / Assets', linkTo: '/asset-management/asset', permission: 'asset', isClickable: true},
                    {name: 'Show', linkTo: '/asset-management/asset/show', permission: ''},]}
                isShowPage={true}
            />
            <MuiCardComponent>
                <ViewCardComponent
                    data={[
                        {label: 'Asset Name', value: data.name},
                        {label: 'Category Name', value: data?.categoryName},
                        {label: 'Description', value: data?.description},
                    ]}
                    titleA="Category"
                    titleB={data.name}
                />
            </MuiCardComponent>
        </ProtectedRoute>
    );
};

