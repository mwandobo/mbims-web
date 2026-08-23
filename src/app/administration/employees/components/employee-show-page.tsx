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

export default function EmployeeShowPage({employeeId}: { employeeId: string }) {
    const permission = 'employee'
    const router = useRouter()
    const [data, setData] = useState<any>([])
    const [loading, setLoading] = useState(false)
    const [refresh, setRefresh] = useState(false)


    const id = employeeId

    const url = `administration/employees/${id}`
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


    const onSave = async () => {
        try {
            const res = await postRequest(`${url}/share-credential`, {});
            if (data && res.status === 200) {
                setRefresh(!refresh);
            }
        } catch (error: any) {
            console.log(error);
        }
    };

    const handleSubmit = () => {
        showConfirmationModal({
            title: 'Are You Sure?',
            text: `Are You Sure You Want Share Credentials with: ${data?.name}?`,
            onConfirm: onSave,  // Action to perform on confirmation
            onCancel: () => console.log('User canceled the action'), // Optional cancel action
        });
    };


    return (

        <ProtectedRoute
            permission={`${permission}_read`}
            isLoading={loading}
        >
            <PageHeader
                links={[
                    {name: 'Employee', linkTo: '/admnistration/employees', permission: 'employee', isClickable: true},
                    {name: 'Show', linkTo: '/admnistration/employees/show', permission: ''},]}
                isShowPage={true}
            />
            <MuiCardComponent>
                { data.email &&
                    <div>
                        <ButtonComponent
                            name={`${data.isCredentialShared? "Resend Credentials" : "Share Credentials"}`}
                            onClick={handleSubmit}
                            rounded={'md'}
                            padding={'p-3'}
                            shadow={'shadow-md'}
                            bg_color={'bg-gray-50'}
                            hover={'hover:bg-gray-200 hover:border-gray-400'}
                            hover_text={'hover:text-gray-900 hover:font-semibold'}
                            border={'border border-gray-300'}
                            text_color={'text-gray-700'}
                        >
                            <CheckCircle2 size={13}/>
                        </ButtonComponent>
                    </div>
                }

                <ViewCardComponent
                    data={[
                        {label: 'Employee Name', value: data.name},
                        {label: 'Staff No', value: data?.staffNo},
                        {label: 'Email', value: data?.email},
                        {label: 'Phone', value: data?.mobilePhone},
                        {label: 'Date Joined', value: data?.createdAt},
                        {label: 'Gender', value: data?.gender},
                        {label: 'Unit', value: data?.unitName ?? '---'},
                        {label: 'Gender', value: data?.gender},
                        {label: 'Department', value: data?.departmentName ?? '---'},
                        {label: 'Position', value: data?.positionName ?? '---'},
                    ]}
                    titleA="Employee"
                    titleB={data.name}
                />
            </MuiCardComponent>
        </ProtectedRoute>
    );
};

