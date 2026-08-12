"use client"

import ProtectedRoute from "@/components/authentication/protected-route";
import MuiCardComponent from "@/components/card/mui-card.component";
import ViewCardComponent from "@/components/card/view.card.component";
import PageHeader from "@/components/header/page-header";
import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {getRequest} from "@/utils/api-calls.util";


export default function TransactionShowPage({transactionId}: { transactionId: string }) {
    const permission = 'transaction'

    const [data, setData] = useState<any>([])
    const [loading, setLoading] = useState(false)
    const router = useRouter()


    const url = `transactions/${transactionId}`
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
                        name: 'Transactions',
                        linkTo: '/administration/transactions',
                        permission: 'transactions_read',
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
                            {label: 'Customer Name', value: data?.customerName},
                            {label: 'Transaction Date', value: data?.transactionDate},
                            {label: 'Transaction Type', value: data?.transactionType},
                            {label: 'Transaction Channel', value: data?.transactionChannelType},
                            {label: 'Justification', value: data?.justification},
                            {label: 'Product Name', value: data?.productName},
                            {label: 'Unit', value: data?.unitId},
                        ]}
                        titleA={`Customer`}
                        titleB={` ${data?.name} `}
                    />
                </div>
            </MuiCardComponent>
        </ProtectedRoute>
    );
};
