"use client"

import ProtectedRoute from "@/components/authentication/protected-route";
import MuiCardComponent from "@/components/card/mui-card.component";
import ViewCardComponent from "@/components/card/view.card.component";
import PageHeader from "@/components/header/page-header";
import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {getRequest} from "@/utils/api-calls.util";
import moneyFormatComponent from "@/components/money-format.component";


export default function DepositShowPageComponent({depositId}: { depositId: string }) {
    const permission = 'deposits'

    const [data, setData] = useState<any>([])
    const [loading, setLoading] = useState(false)
    const router = useRouter()


    const url = `deposits/${depositId}`
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
                        name: 'Deposit',
                        linkTo: '/administration/deposit',
                        permission: 'deposits_read',
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
                            {label: 'Amount', value: moneyFormatComponent({amount: data?.amount}) },
                            {label: 'Transaction Date', value: data?.transactionDate},
                            {label: 'Ledge Code', value: data?.ledgerCode},
                            {label: 'Justification', value: data?.justification},
                            {label: 'Product Name', value: data?.productName},
                            {label: 'Unit', value: data?.unitId},
                        ]}
                        titleA={`Customer`}
                        titleB={` ${data?.customerName} `}
                    />
                </div>
            </MuiCardComponent>
        </ProtectedRoute>
    );
};
