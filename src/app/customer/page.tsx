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
        id: 'name',
        numeric: false,
        disablePadding: false,
        label: 'Customer Name',
        width: '30%',

    },
    {
        id: 'dateOfBirth',
        numeric: false,
        disablePadding: false,
        label: 'Birthdate',
        width: '64%',
    },
]

function Customers() {
    const permission = 'customer'

    const {
        loading,
        createdForm,
        handleClick,
        tabular

    } = usePageDataHook({
        columns: columns,
        formInputs: deptFormInputs,
        url: 'customers',
        modalTitle: 'Customer',
        viewUrl: '/customers/',
        state_properties: [],
        permission: permission,
        isApiV2: true,
        isMaintainViewNavigationForV1: true
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
                        name: 'Customers / List',
                        linkTo: '/customers',
                        permission: permission,
                        isClickable: true
                    },
                ]}/>
            {tabular()}
            {createdForm()}

        </ProtectedRoute>
    )
}

export default Customers