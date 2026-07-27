"use client"

import ProtectedRoute from '@/components/authentication/protected-route'
import PageHeader from '@/components/header/page-header'
import React from 'react'
import { usePageDataHook } from "@/hooks/page-render-hooks/use-page-data.hook";

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
        name: 'manager',
        type: 'select',
        label: 'Manager',
        value: '',
        optionsUrlData: `/fetch-data/employees`,
        optionDataKey: 'name',
        required: true,
        isError: false,
        errorMessage: '',
        layout: 'column'
    },
    {
        name: 'code',
        type: 'text',
        label: 'Unit Code',
        value: '',
        required: true,
        isError: false,
        errorMessage: '',
        layout: 'column',
    },
]

const columns = [
    {
        id: 'name',
        numeric: false,
        disablePadding: false,
        label: 'Unit Name',
        width: '30%',

    },
    {
        id: 'code',
        numeric: false,
        disablePadding: false,
        label: 'Unit Code',
        width: '30%',

    },
    {
        id: 'manager',
        numeric: false,
        disablePadding: false,
        label: 'Manager',
        width: '64%',
    },
]

function Departments() {
    const permission = 'unit'

    const {
        loading,
        createdForm,
        handleClick,
        tabular

    } = usePageDataHook({
        columns: columns,
        formInputs: deptFormInputs,
        url: 'administration/units',
        modalTitle: 'Unit',
        viewUrl: '/administration/units/',
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
                        name: 'Units / List',
                        linkTo: '/administration/units',
                        permission: permission,
                        isClickable: true
                    },
                ]} />
            {tabular()}
            {createdForm()}

        </ProtectedRoute>
    )
}

export default Departments