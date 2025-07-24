"use client"

import ProtectedRoute from "@/components/authentication/protected-route";
import MuiCardComponent from "@/components/card/mui-card.component";
import ViewCardComponent from "@/components/card/view.card.component";
import PageHeader from "@/components/header/page-header";
import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {getRequest} from "@/utils/api-calls.util";


export default function DepartmentShowPage({departmentId}: { departmentId: string }) {
    const permission = 'department'

    const [data, setData] = useState<any>([])
    const [loading, setLoading] = useState(false)
    const router = useRouter()


    const url = `departments/${departmentId}`
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
                        name: 'Department',
                        linkTo: '/administration/departments',
                        permission: 'departments',
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
                            {label: 'Department Name', value: data?.name},
                        ]}
                        titleA={`Department`}
                        titleB={` ${data?.name} `}
                    />
                </div>
            </MuiCardComponent>
        </ProtectedRoute>
    );
};
