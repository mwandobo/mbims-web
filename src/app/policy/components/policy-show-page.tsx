"use client"

import ProtectedRoute from "@/components/authentication/protected-route";
import MuiCardComponent from "@/components/card/mui-card.component";
import ViewCardComponent from "@/components/card/view.card.component";
import PageHeader from "@/components/header/page-header";
import React, {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {getRequest} from "@/utils/api-calls.util";

export default function PolicyShowPage({policyId}: { policyId: string }) {
    const permission = 'policy'

    const [data, setData] = useState<any>([])
    const [loading, setLoading] = useState(false)
    const [refresh, setRefresh] = useState(false)
    const id = policyId
    const router = useRouter()

    const url = `policies/${id}`
    const navigateToLogin = () => {
        return router.push('/login')
    }
    const fetchData = async () => {
        try {
            setLoading(true)
            const res = await getRequest(url)

            if (res && res.status === 200) {
                setData(res.data)
                setLoading(false)
            }
        } catch (error: any) {
            if (error?.code === "ERR_NETWORK") {
                navigateToLogin()
            }
        }
    };

    useEffect(() => {
        fetchData()
    }, [refresh])


    const onSave = async () => {
        try {
            const res = await getRequest(`${url}/close`);
            if (data && res.status === 200) {
                setRefresh(!refresh);
            }
        } catch (error: any) {
            console.log(error);
        }
    };

    return (
        <ProtectedRoute
            permission={`${permission}_read`}
            isLoading={loading}
        >
            <PageHeader
                links={[
                    {name: 'Policies', linkTo: '/policies', permission: 'policies', isClickable: true},
                    {name: 'Show', linkTo: '/', permission: ''},
                ]}
                isShowPage={true}
            />
            <MuiCardComponent>
                <ViewCardComponent
                    data={[
                        {label: 'Policy Title', value: data?.title},
                        {label: "Policy Owner", value: data?.owner},
                        {label: 'Department Name', value: data?.departmentName},
                        {label: 'Issuance Date', value: data.issuanceDate},
                        {label: 'Approval Date', value: data.approvalDate},
                        {label: 'Next Renewal Date', value: data.nextRenewalDate},
                        {label: 'Status', value: data.status},
                        {
                            label: 'Policy File',
                            value: data?.fileUrl ? (
                                <a href={data?.fileUrl} target="_blank" rel="noopener noreferrer"
                                   className="text-blue-600 border-b border-gray-300 underline underline-offset-3">
                                    View File
                                </a>
                            ) : 'No file available'
                        },

                    ]}
                    titleA="Policy"
                    titleB={data?.title}
                />
            </MuiCardComponent>
        </ProtectedRoute>
    );
};

