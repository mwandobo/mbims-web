"use client"

import ProtectedRoute from "@/components/authentication/protected-route";
import MuiCardComponent from "@/components/card/mui-card.component";
import ViewCardComponent from "@/components/card/view.card.component";
import PageHeader from "@/components/header/page-header";
import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {getRequest} from "@/utils/api-calls.util";


export default function AssetCategoryShowPage({assetCategoryId}: { assetCategoryId: string }) {
    const permission = 'department'

    const [data, setData] = useState<any>([])
    const [loading, setLoading] = useState(false)
    const router = useRouter()


    const url = `asset-categories/${assetCategoryId}`
    const navigateToLogin = () => {
        return router.push('/login')
    }


    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                const res = await getRequest(url)

                if (res.status === 200) {
                    setData(res.data)
                    setLoading(false)
                }

            } catch (error: any) {
                if (error?.code === "ERR_NETWORK") {
                    navigateToLogin()
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
                    {
                        name: 'Asset Management / Asset Category',
                        linkTo: '/administration/asset-category',
                        permission: 'asset_category',
                        isClickable: true
                    },
                    {name: 'Show', linkTo: '', permission: ''}
                ]}
                isShowPage={true}
            />
            <MuiCardComponent>
                <div className="mb-3">
                    <ViewCardComponent
                        data={[
                            {label: 'Category Name', value: data?.name},
                            {label: 'Description', value: data?.description},
                        ]}
                        titleA={`Asset Category`}
                        titleB={` ${data?.name} `}
                    />
                </div>
            </MuiCardComponent>
        </ProtectedRoute>
    );
};
