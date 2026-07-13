"use client"

import ProtectedRoute from "@/components/authentication/protected-route";
import MuiCardComponent from "@/components/card/mui-card.component";
import ViewCardComponent from "@/components/card/view.card.component";
import PageHeader from "@/components/header/page-header";
import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {getRequest} from "@/utils/api-calls.util";


export default function CustomerShowPage({customerId}: { customerId: string }) {
    const permission = 'customer'

    const [data, setData] = useState<any>([])
    const [loading, setLoading] = useState(false)
    const router = useRouter()


    const url = `customers/${customerId}`
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
                        name: 'Customers',
                        linkTo: '/administration/customers',
                        permission: 'customers',
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
                            {label: 'Customer Name', value: data?.name},
                            {label: 'Sex', value: data?.sex},
                            {label: 'Birth Date', value: data?.dateOfBirth},
                            {label: 'Marital Status', value: data?.maritalStatus},
                            {label: 'Mobile Number', value: data?.phoneNumber},
                            {label: 'Email', value: data?.email},
                            {label: 'Birth Location', value: data?.birthRegion},
                            {label: 'Customer Type', value: data?.customerType},
                            {label: 'Nationality', value: data?.nationality},
                            {label: 'Region', value: data?.region},
                            {label: 'District', value: data?.district},
                            {label: 'Ward', value: data?.ward},
                            {label: 'Citizenship', value: data?.citizenship},
                            {label: 'Residency', value: data?.residency},
                            {label: 'Profession', value: data?.profession},
                            {label: 'Employment Status', value: data?.employmentStatus},
                            {label: 'Number of Dependents', value: data?.numberDependants},
                            {label: 'Education Level', value: data?.educationLevel},
                            {label: 'Identification Type', value: data?.identificationType},
                            {label: 'Identification Number', value: data?.identificationNumber},
                            {label: 'ID Issuance Date', value: data?.idIssuanceDate},
                            {label: 'ID Expiration Date', value: data?.idExpirationDate},
                        ]}
                        titleA={`Customer`}
                        titleB={` ${data?.name} `}
                    />
                </div>
            </MuiCardComponent>
        </ProtectedRoute>
    );
};
