"use client"

import ProtectedRoute from "@/components/authentication/protected-route";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ViewCardItemApartComponent from "@/components/card/view.card-item-apart.component";
import {getRequest} from "@/utils/api-calls.util";

const SubContractView = (payload: any) => {
    const [data, setData] = useState<any>([])
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const url = `contracts/${payload?.contractId}/files/${payload?.id}`

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
        if(payload){
            fetchData()
        }
    }, [payload])

    return (

        <ProtectedRoute>
            {
                loading ? <p>Loading...</p>
                    :
                    <>
                            <div className="mb-3 w-full ">
                                <ViewCardItemApartComponent
                                    data={[
                                        { label: 'Title', value: data?.title },
                                        { label: 'Description', value: data?.description },
                                        {
                                            label: 'File',
                                            value: data?.fileUrl ? (
                                                <a href={data?.fileUrl} target="_blank" rel="noopener noreferrer"
                                                   className="text-blue-600 border-b border-gray-300 underline underline-offset-3">
                                                    View File
                                                </a>
                                            ) : 'No file available'
                                        },
                                    ]}
                                    titleA={`Contract File`}
                                    titleB={` ${data?.title} `}
                                />
                            </div>
                    </>
            }
        </ProtectedRoute>
    );
};

export default SubContractView;