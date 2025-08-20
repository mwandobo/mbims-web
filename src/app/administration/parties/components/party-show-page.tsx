"use client"

import ProtectedRoute from "@/components/authentication/protected-route";
import MuiCardComponent from "@/components/card/mui-card.component";
import ViewCardComponent from "@/components/card/view.card.component";
import PageHeader from "@/components/header/page-header";
import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import {getRequest} from "@/utils/api-calls.util";

export default function PartyShowPage({partyId}: { partyId: string }) {
    const permission = 'supplier'
    const router = useRouter()
    const [data, setData] = useState<any>([])
    const [loading, setLoading] = useState(false)

    const id =  partyId

    const url = `parties/${id}`
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
                                {
                                    name: 'Party',
                                    linkTo: '/administration/parties',
                                    permission: 'party',
                                    isClickable: true
                                },
                                {name: 'Show', linkTo: '/administration/parties/show', permission: ''},]}
                            isShowPage={true}
                        />
                        <MuiCardComponent>
                            <ViewCardComponent
                                data={[
                                    {label: 'Party Name', value: data.name},
                                    {label: 'Phone', value: data?.phone},
                                    {label: 'Email', value: data?.email},
                                    {label: 'Description', value: data?.description},
                                    // { label: 'Status', value: StatusCreatorHelperActive(passedData?.status) },

                                ]}
                                titleA="Party"
                                titleB={data.name}
                            />

                        </MuiCardComponent>
        </ProtectedRoute>

    );
};

