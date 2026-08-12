"use client"

import ProtectedRoute from '@/components/authentication/protected-route'
import PageHeader from '@/components/header/page-header'
import React from 'react'
import {usePageDataHook} from "@/hooks/page-render-hooks/use-page-data.hook";

const deptFormInputs = [
    {
        name: 'name',
        type: 'text',
        label: 'Name',
        value: '',
        required: true,
        isError: false,
        errorMessage: '',
        layout: 'column',
    },
    {
        name: 'description',
        type: 'textArea',
        label: 'Description',
        value: '',
        isError: false,
        errorMessage: ''
    }
]

const columns = [
    {
        id: 'customerName',
        numeric: false,
        disablePadding: false,
        label: 'Customer Name',
    },
     {
        id: 'transactionDate',
        numeric: false,
        disablePadding: false,
        label: 'Transaction Date',
    },

      {
        id: 'transactionType',
        numeric: false,
        disablePadding: false,
        label: 'Transaction Type',
    },
      {
        id: 'transactionChannelType',
        numeric: false,
        disablePadding: false,
        label: 'Transaction Channel',
    },
]

function Transactions() {
    const permission = 'transaction'

    const {
        loading,
        createdForm,
        handleClick,
        tabular

    } = usePageDataHook({
        columns: columns,
        formInputs: deptFormInputs,
        url: 'transactions',
        modalTitle: 'Transaction',
        viewUrl: '/transaction/',
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
                        name: 'Transactions / List',
                        linkTo: '/transactions',
                        permission: permission,
                        isClickable: true
                    },
                ]}/>
            {tabular()}
            {createdForm()}

        </ProtectedRoute>
    )
}

export default Transactions