"use client"

import ProtectedRoute from "@/components/authentication/protected-route";
import MuiCardComponent from "@/components/card/mui-card.component";
import ViewCardComponent from "@/components/card/view.card.component";
import PageHeader from "@/components/header/page-header";
import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import {getRequest} from "@/utils/api-calls.util";
import Swal from "sweetalert2";

export default function ApprovalShowPage({approvalId}: { approvalId: string }) {
    const permission = 'approval'
    const router = useRouter()
    const [data, setData] = useState<any>([])
    const [loading, setLoading] = useState(false)

    const id = approvalId

    const url = `user-approvals/${id}`


    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            if (id) {
                try {
                    setLoading(true)
                    const res = await getRequest(url)
                    if ( res.status === 200) {
                        setData(res.data)
                        setLoading(false)
                    }

                } catch (error: any) {
                    Swal.fire({
                        title: 'Error Occured!',
                        text: error ?? error.message,
                        icon: 'error',
                    }).then(() => setLoading(false))

                    console.log(error);

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
                    {name: 'Approval', linkTo: '/administration/approvals', permission: 'approvals', isClickable: true},
                    {name: 'Show', linkTo: '/administration/approvals/show', permission: ''},]}
                isShowPage={true}
            />
            <MuiCardComponent>
                <ViewCardComponent
                    data={[
                        {label: 'Approval Name', value: data.name},
                        {label: 'System (Mapped) Approval Name', value: data?.sysApproval?.name},
                        {label: 'Description', value: data?.description},
                    ]}
                    titleA="Approval"
                    titleB={data.name}
                />
            </MuiCardComponent>
        </ProtectedRoute>
    );
};

