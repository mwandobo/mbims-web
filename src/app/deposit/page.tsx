"use client"

import ProtectedRoute from '@/components/authentication/protected-route'
import PageHeader from '@/components/header/page-header'
import React from 'react'
import {usePageDataHook} from "@/hooks/page-render-hooks/use-page-data.hook";

const inputs = []

const columns = [
    {
        id: 'customerName',
        numeric: false,
        disablePadding: false,
        label: 'Customer Name',
    },
    {
        id: 'amount',
        numeric: false,
        disablePadding: false,
        label: 'Transaction Amount',
        type: 'number',

    },
    {
        id: 'transactionDate',
        numeric: false,
        disablePadding: false,
        label: 'Transaction Date',
    },
    {
        id: 'ledgerCode',
        numeric: false,
        disablePadding: false,
        label: 'Ledger Code',
    },

]

function DepositPage() {
    const permission = 'deposits'

    const {
        loading,
        createdForm,
        handleClick,
        tabular

    } = usePageDataHook({
        columns: columns,
        formInputs: inputs,
        url: 'deposits',
        modalTitle: 'Deposit',
        viewUrl: '/deposit/',
        state_properties: [],
        permission: permission,
        isApiV2: true,
        isMaintainViewNavigationForV1: true,
        isHideDelete: true,
        isHideEdit: true,
    })

    return (
        <ProtectedRoute
            permission={`${permission}_read`}
            isLoading={loading}
        >
            <PageHeader
                handleClick={handleClick}
                permission={`${permission}_create`}
                links={[
                    {
                        name: 'Deposit / List',
                        linkTo: '/deposits',
                        permission: permission,
                        isClickable: true
                    },
                ]}/>
            {tabular()}
            {createdForm()}

        </ProtectedRoute>
    )
}

export default DepositPage