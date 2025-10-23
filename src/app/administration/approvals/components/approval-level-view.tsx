"use client"

import ProtectedRoute from "@/components/authentication/protected-route";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ViewCardItemApartComponent from "@/components/card/view.card-item-apart.component";
import {getRequest} from "@/utils/api-calls.util";
import Swal from "sweetalert2";

const ApprovalLevelView = (payload: any) => {
    const [data, setData] = useState<any>([])
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const id = payload?.id
    const url = `approval-levels/${id}`

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                const res = await getRequest(url)

                if (data && res.status === 200) {
                    setData(res.data)
                    setLoading(false)
                }

            } catch (error: any) {
                Swal.fire({
                    title: 'Error Occured!',
                    text: error ?? error.message,
                    icon: 'error',
                }).then(() => setLoading(false))
            }
        };
        if(id){
            fetchData()
        }
    }, [id])

    return (
        <ProtectedRoute>
            {
                loading ? <p>Loading...</p>
                    :
                    <>
                        <div className="mb-3 w-full ">
                            <ViewCardItemApartComponent
                                data={[
                                    { label: 'Level Name', value: data?.name },
                                    { label: 'Level', value: data?.level },
                                    { label: 'Role Name', value: data?.role?.name },
                                    { label: 'Description', value: data?.description },
                                ]}
                                titleA={`Approval Level`}
                                titleB={` ${data?.name} `}
                            />
                        </div>
                    </>
            }
        </ProtectedRoute>
    );
};

export default ApprovalLevelView;