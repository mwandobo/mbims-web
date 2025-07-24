"use client"

import ProtectedRoute from '@/components/authentication/protected-route'
import PageHeader from '@/components/header/page-header'
import React from 'react'
import {usePageDataHook} from "@/hooks/page-render-hooks/use-page-data.hook";

interface Props {
    parent_id?: string
    subHeader?: string
}

function Clients({
                     subHeader
                 }: Props) {

    const _deptFormInputs = [
        {
            name: 'name',
            type: 'text',
            label: 'Client Name',
            value: '',
            required: true,
            isError: false,
            errorMessage: ''
        },
        {
            name: 'phone',
            type: 'text',
            label: 'Phone',
            value: '',
            required: true,
            isError: false,
            errorMessage: ''
        },
        {
            name: 'email',
            type: 'text',
            label: 'Email',
            value: '',
            required: true,
            isError: false,
            errorMessage: ''
        },
    ]
    const _columns = [
        {
            id: 'name',
            numeric: false,
            disablePadding: false,
            label: 'Client Name',
        },
        {
            id: 'phone',
            numeric: false,
            disablePadding: false,
            label: 'Phone',
        },
        {
            id: 'email',
            numeric: false,
            disablePadding: false,
            label: 'Email',
        },
    ]

    const permission = 'client'
    const url = `/clients`

    const {
        loading,
        createdForm,
        handleClick,
        tabular,
    } = usePageDataHook({
        columns: _columns,
        formInputs: _deptFormInputs,
        url: url,
        modalTitle: 'Client',
        viewUrl: '/administration/clients/',
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
                links={[{name: 'Clients / List', linkTo: '/administration/clients', permission: ''}]}
                subHeader={subHeader}
                permission={`${permission}_create`}
            />
            {tabular()}
            {createdForm()}

        </ProtectedRoute>
    )
}

export default Clients