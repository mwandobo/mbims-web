"use client"

import ProtectedRoute from "@/components/authentication/protected-route";
import MuiCardComponent from "@/components/card/mui-card.component";
import ViewCardComponent from "@/components/card/view.card.component";
import PageHeader from "@/components/header/page-header";
import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import {getRequest} from "@/utils/api-calls.util";
import {Check, CheckCircle2, X} from "lucide-react";

export default function PositionShowPage({positionId}: { positionId: string }) {
    const permission = 'position'
    const router = useRouter()
    const [data, setData] = useState<any>([])
    const [loading, setLoading] = useState(false)

    const id = positionId

    const url = `positions/${id}`
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
                    {name: 'Position', linkTo: '/administration/position', permission: 'position', isClickable: true},
                    {name: 'Show', linkTo: '/administration/position/show', permission: ''},]}
                isShowPage={true}
            />
            <MuiCardComponent>
                <ViewCardComponent
                    data={[
                        {label: 'Position Name', value: data.name},
                        {label: 'Department Name', value: data?.departmentName},
                        {label: 'Description', value: data?.description},
                    ]}
                    titleA="Position"
                    titleB={data.name}
                />
            </MuiCardComponent>
        </ProtectedRoute>
    );
};

