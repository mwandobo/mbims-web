"use client"

import ProtectedRoute from "@/components/authentication/protected-route";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ViewCardItemApartComponent from "@/components/card/view.card-item-apart.component";
import {getRequest} from "@/utils/api-calls.util";

const RequestedItemView = (payload: any) => {
    const [data, setData] = useState<any>([])
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const id = payload?.id
    const url = `requested-assets/${id}`
    const navigateToLogin = () => {
        return router.push('/login')
    }

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
                if (error?.code === "ERR_NETWORK") {
                    navigateToLogin()
                }
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
                                    { label: 'Asset Name', value: data?.assetName },
                                    { label: 'Category Name', value: data?.categoryName },
                                ]}
                                titleA={`Requested Asset`}
                                titleB={` ${data?.assetName} `}
                            />
                        </div>
                    </>
            }
        </ProtectedRoute>
    );
};

export default RequestedItemView;