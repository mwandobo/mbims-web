"use client"

import ProtectedRoute from "@/components/authentication/protected-route";
import MuiCardComponent from "@/components/card/mui-card.component";
import ViewCardComponent from "@/components/card/view.card.component";
import PageHeader from "@/components/header/page-header";
import {useRouter} from "next/navigation";
import React, {useEffect, useState} from "react";
import {getRequest, postRequest} from "@/utils/api-calls.util";
import {Check, CheckCircle2, X} from "lucide-react";
import {ButtonComponent} from "@/components/button/button.component";
import {showConfirmationModal} from "@/utils/show-alert-dialog";
import {checkPermissions} from "@/utils/check-permissions";

export default function ReconciliationShowPage({reconciliationId}: { reconciliationId: string }) {
    const permission = 'reconciliation'
    const router = useRouter()
    const [data, setData] = useState<any>([])
    const [loading, setLoading] = useState(false)
    const [refresh, setRefresh] = useState(false)


    const id = reconciliationId

    const url = `reconciliations/${id}`
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
    }, [refresh])



    return (

        <ProtectedRoute
            permission={`${permission}_read`}
            isLoading={loading}
        >
            <PageHeader
                links={[
                    {name: 'Reconciliation', linkTo: '/reconciliation', permission: 'reconciliation', isClickable: true},
                    {name: 'Show', linkTo: '/reconciliation/show', permission: ''},]}
                isShowPage={true}
            />
            <MuiCardComponent>


                <ViewCardComponent
                    data={[
                        {label: 'Reconciliation Code', value: data.code},
                        {label: 'Reconciliation Date', value: data?.createdAt},
                        {label: 'Staff Name', value: data?.staffName},
                        {label: 'Reconciliation Status', value: data?.status}

                    ]}
                    titleA="Reconciliation"
                    titleB={data.code}
                />
            </MuiCardComponent>
        </ProtectedRoute>
    );
};

