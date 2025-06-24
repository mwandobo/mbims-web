"use client"

import ProtectedRoute from "@/components/authentication/protected-route";
import MuiCardComponent from "@/components/card/mui-card.component";
import ViewCardComponent from "@/components/card/view.card.component";
import PageHeader from "@/components/header/page-header";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {getRequest} from "@/utils/api-calls.util";
import Clients from "@/app/administration/clients/page";

const ClientShow = ({ params }: { params: { clientId: string } }) => {
    const { clientId } = params;
    const router = useRouter()
    const [data, setData] = useState<any>([])
    const [loading, setLoading] = useState(false)

    const id = clientId

    const url = `clients/${id}`
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

        <ProtectedRoute>
            {
                loading ? <p>Loading...</p>
                    :
                    <>
                        <PageHeader
                            links={[
                                {
                                    name: 'Clients',
                                    linkTo: '/administration/suppliers',
                                    permission: 'client',
                                    isClickable: true
                                },
                                {name: 'Show', linkTo: '/administration/suppliers/show', permission: ''},]}
                            isShowPage={true}
                        />
                        <MuiCardComponent>
                            <ViewCardComponent
                                data={[
                                    {label: 'Client Name', value: data.name},
                                    {label: 'Phone', value: data?.phone},
                                    {label: 'Email', value: data?.email},
                                    {label: 'Birth Date', value: data?.dateOfBirth},
                                    // { label: 'Status', value: StatusCreatorHelperActive(passedData?.status) },

                                ]}
                                titleA="Client"
                                titleB={data.name}
                            />

                        </MuiCardComponent>
                    </>
            }
        </ProtectedRoute>

    );
};

export default ClientShow

