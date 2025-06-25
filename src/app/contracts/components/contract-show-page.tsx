"use client"

import ProtectedRoute from "@/components/authentication/protected-route";
import MuiCardComponent from "@/components/card/mui-card.component";
import ViewCardComponent from "@/components/card/view.card.component";
import PageHeader from "@/components/header/page-header";
import MuiTab from "@/components/tabs/mui-tab";
import React, {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {CheckCircle2} from "lucide-react";
import {getRequest} from "@/utils/api-calls.util";
import {showConfirmationModal} from "@/utils/show-alert-dialog";
import SubContract from "@/app/contracts/fragments/sub-contract";
import {ButtonComponent} from "@/components/button/button.component";
import ContractFile from "@/app/contracts/fragments/contract-file";
import ContractExtension from "@/app/contracts/fragments/contract-extension";

export default function ContractShowPage({contractId}: { contractId: string }) {

    const [data, setData] = useState<any>([])
    const [loading, setLoading] = useState(false)
    const [refresh, setRefresh] = useState(false)
    const id = contractId
    const router = useRouter()

    const url = `contracts/${id}`
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

    const handleSubmit = () => {
        showConfirmationModal({
            title: 'Are You Sure?',
            text: `Are You Sure You Want To Close Project: ${data?.name}?`,
            onConfirm: onSave,  // Action to perform on confirmation
            onCancel: () => console.log('User canceled the action'), // Optional cancel action
        });
    };

    const nodes: React.ReactNode[] = [
        <ContractFile
            key={'contract-file'}
            contract_id={id}
        />,
        <SubContract
            key={'sub-contract'}
            contract_id={id}
        />,
        <ContractExtension
            key={'contract-extensions'}
            contract_id={id}
        />,
    ];

    const buttonsBody = () => {
        return <>
            {data?.status === 'pending' &&
                <ButtonComponent
                    name={'Close Project'}
                    onClick={() => handleSubmit()}
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
            }
        </>
    }

    return (
        <ProtectedRoute>
            {
                loading ? <p>Loading...</p>
                    :
                    <>
                        <PageHeader
                            links={[
                                {name: 'Contracts', linkTo: '/contracts', permission: 'contracts', isClickable: true},
                                {name: 'Show', linkTo: '/', permission: ''},
                            ]}
                            isShowPage={true}
                        />
                        <MuiCardComponent>
                            <ViewCardComponent
                                data={[
                                    {label: 'Contract Title', value: data?.title},
                                    {label: 'Contract Amount', value: data?.amount},
                                    {label: 'Contract Group', value: data?.group},
                                    {
                                        label: data?.group === 'client' ? 'Client Name' : "Supplier Name",
                                        value: data?.supplierName
                                    },
                                    {label: 'Department Name', value: data?.departmentName},
                                    {label: 'Status', value: data.status},
                                    {label: 'Start Date', value: data.startDate},
                                    {label: 'End Date', value: data.endDate},
                                    {label: 'Extended Date', value: data.farthestExtendedDate ?? '---'},
                                    {label: 'Extended Amount', value: data.totalExtensionAmount },
                                    {label: 'Total Amount', value: Number(data?.amount) + Number(data.totalExtensionAmount) },
                                    {
                                        label: 'Contract File',
                                        value: data?.fileUrl ? (
                                            <a href={data?.fileUrl} target="_blank" rel="noopener noreferrer"
                                               className="text-blue-600 border-b border-gray-300 underline underline-offset-3">
                                                View File
                                            </a>
                                        ) : 'No file available'
                                    },

                                ]}
                                titleA="Contract"
                                titleB={data?.title}
                            />

                            <div className={'mt-3 px-4'}>
                                <MuiTab
                                    columns={
                                        [
                                            "Contract Files",
                                            "Sub Contracts",
                                            "Contract Extensions",
                                        ]
                                    }
                                    nodes={
                                        nodes // Show all nodes when condition is true
                                    }
                                />
                            </div>
                        </MuiCardComponent>
                    </>
            }
        </ProtectedRoute>
    );
};

