"use client"

import ProtectedRoute from "@/components/authentication/protected-route";
import MuiCardComponent from "@/components/card/mui-card.component";
import ViewCardComponent from "@/components/card/view.card.component";
import PageHeader from "@/components/header/page-header";
import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {getRequest} from "@/utils/api-calls.util";


export default function UnitShowPage({unitId}: { unitId: string }) {
    const permission = 'unit'

    const [data, setData] = useState<any>([])
    const [loading, setLoading] = useState(false)
    const router = useRouter()


    const url = `administration/units/${unitId}`
    const navigateToLogin = () => {
        return router.push('/login')
    }


    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                const res = await getRequest(url)

                console.log('res', res)


                if (res.status === 200) {
                    console.log('res.data', res.data)

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
                        name: 'Units',
                        linkTo: '/administration/units',
                        permission: 'units',
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
                            {label: 'Unit Name', value: data?.name},
                            {label: 'Description', value: data?.description},
                        ]}
                        titleA={`Unit`}
                        titleB={` ${data?.name} `}
                    />
                </div>
            </MuiCardComponent>
        </ProtectedRoute>
    );
};
