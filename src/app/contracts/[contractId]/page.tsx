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
import FormattedMoney from "@/components/money-format.component";


const ProjectShow = ({params}: { params: { projectId: string } }) => {
    const [data, setData] = useState<any>([])
    const [loading, setLoading] = useState(false)
    const [refresh, setRefresh] = useState(false)
    const id = params.projectId
    const router = useRouter()

    const url = `project/show/${id}`
    const navigateToLogin = () => {
        return router.push('/login')
    }
    const fetchData = async () => {
        try {
            setLoading(true)
            const res = await getRequest(url)

            if (res && res.status === 200) {
                setData(res.data.data)
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
        <SubContract
            key={'sub-contract'}
            project={data}
        />,
    ];

    const communicationChannels = (data: any) => {
        return (
            <div className="flex flex-col text-xs">
                {data && data.map((item, index) => (
                    <div key={index} className="flex justify-between">
                        <span className="font-medium">{item.name}</span>
                        <span className="text-gray-600">{item.location}</span>
                    </div>
                ))}
            </div>
        );
    };


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
                                {name: 'Project', linkTo: '/projects', permission: 'projects', isClickable: true},
                                {name: 'Show', linkTo: '/', permission: ''},
                            ]}
                            isShowPage={true}
                        />
                        <MuiCardComponent>
                            <ViewCardComponent
                                data={[
                                    {label: 'Code', value: data?.code},
                                    {label: 'Project Name', value: data?.name},
                                    {label: 'Project Pillar', value: data?.type},
                                    {label: 'Project Location', value: data?.location},
                                    {label: 'Project Owner', value: data?.owner},
                                    {label: 'Communication Channel', value: communicationChannels(data.communication_channels)},
                                    {label: 'Start Date', value: data.formatted_start_date},
                                    {label: 'End Date', value: data.formatted_end_date},
                                    {
                                        label: 'Total Direct Cost',
                                        value: <FormattedMoney amount={data.total_direct_cost}/>
                                    },
                                    {
                                        label: 'Total Resource Cost',
                                        value: <FormattedMoney amount={data.total_resource_cost}/>
                                    },
                                    {
                                        label: 'Grand Total Cost',
                                        value: <FormattedMoney amount={data.grand_total_cost}/>
                                    },
                                    {label: 'Prepared By', value: data?.prepared_by},
                                    {label: 'Description', value: data?.description},
                                    {label: 'Summary', value: data?.summary},
                                    {label: 'Scope', value: data?.scope},
                                    {label: 'Purpose', value: data?.purpose},
                                    {label: 'Progress', value: data.progress_status},
                                    {label: 'Status', value: data.status},

                                ]}
                                titleA="Project"
                                titleB={data?.name}
                            />
                        </MuiCardComponent>
                        <MuiCardComponent>
                            <MuiTab
                                columns={
                                        [
                                            "Sub Contracts",
                                        ]
                                }
                                nodes={
                                        nodes // Show all nodes when condition is true
                                }
                            />
                        </MuiCardComponent>
                    </>
            }
        </ProtectedRoute>
    );
};

export default ProjectShow;