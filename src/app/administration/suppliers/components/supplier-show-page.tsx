"use client"

import ProtectedRoute from "@/components/authentication/protected-route";
import MuiCardComponent from "@/components/card/mui-card.component";
import ViewCardComponent from "@/components/card/view.card.component";
import PageHeader from "@/components/header/page-header";
import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import {getRequest} from "@/utils/api-calls.util";

export default function SupplierShowPage({supplierId}: { supplierId: string }) {

    const router = useRouter()
    const [data, setData] = useState<any>([])
    const [loading, setLoading] = useState(false)

    const id = {
        supplierId
    }

    const url = `suppliers/${id}`
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
                                    name: 'Supplier',
                                    linkTo: '/administration/suppliers',
                                    permission: 'employees',
                                    isClickable: true
                                },
                                {name: 'Show', linkTo: '/administration/suppliers/show', permission: ''},]}
                            isShowPage={true}
                        />
                        <MuiCardComponent>
                            <ViewCardComponent
                                data={[
                                    {label: 'Supplier Name', value: data.fullName},
                                    {label: 'Phone', value: data?.phone},
                                    {label: 'Email', value: data?.email},
                                    {label: 'Birth Date', value: data?.dateOfBirth},
                                    // { label: 'Status', value: StatusCreatorHelperActive(passedData?.status) },

                                ]}
                                titleA="Supplier"
                                titleB={data.fullName}
                            />

                        </MuiCardComponent>
                    </>
            }
        </ProtectedRoute>

    );
};

