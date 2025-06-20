"use client"

import ProtectedRoute from "@/components/authentication/protected-route";
import MuiCardComponent from "@/components/card/mui-card.component";
import ViewCardComponent from "@/components/card/view.card.component";
import PageHeader from "@/components/header/page-header";

import { useEffect, useState } from "react";
import {getRequest} from "@/utils/api-calls.util";
import {PermTableComponent} from "@/app/administration/roles/fragments/perm.table.component";
import {useRouter} from "next/navigation";


const RolesShow = ({ params }: { params: { roleId: string } }) => {
    const [data, setData] = useState<any>([])
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const id = params?.roleId

    const navigate = () => router.push(`/administration/roles/assign/${id}`)

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            const res = await getRequest(`roles/${id}`)

            if (res && res.status === 200) {
                setData(res.data)
                setLoading(false)
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
                                { name: 'Role', linkTo: '/roles', permission: 'roles', isClickable: true },
                                { name: 'Show', linkTo: '/roles/show', permission: '' },
                            ]}
                            isShowPage={true}
                        />
                        <MuiCardComponent>

                            <div className="mb-3">
                                <ViewCardComponent
                                    data={[
                                        { label: 'Role Name', value: data?.name },
                                    ]}
                                    titleA={`Role`}
                                    titleB={` ${data?.name} `}
                                    showAssignButton={true}
                                    assignButtonCallBack={navigate}
                                />
                            </div>
                            <hr className="bg-gray-100" />
                            <div className="mt-3 px-3">
                                <div className="border border-solid border-gray-200 p-2">
                                    <h4 className="text-sm font-semibold">Permissions</h4>
                                    <PermTableComponent
                                        data={data?.permissions}
                                    />
                                </div>
                            </div>
                        </MuiCardComponent>
                    </>
            }
        </ProtectedRoute>
    );
};

export default RolesShow;