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
    }
]

const columns = [
    {
        id: 'name',
        numeric: false,
        disablePadding: false,
        label: 'Role Name',
        width: '94%',
    },
]

function Roles() {

    const permission = 'role'

    const {
        loading,
        createdForm,
        handleClick,
        tabular

    } = usePageDataHook({
        columns: columns,
        formInputs: deptFormInputs,
        url: 'roles',
        modalTitle: 'Role',
        viewUrl: '/administration/roles/',
        state_properties: [],
        show_assign: true,
        isApiV2: true,
        isMaintainViewNavigationForV1: true,
        permission: permission
    })

    return (
        <ProtectedRoute
            permission={`${permission}_read`}
            isLoading={loading}
        >
            <PageHeader
                handleClick={handleClick}
                links={[{name: 'Roles / List', linkTo: '/role', permission: ''}]}
                permission={`${permission}_create`}
            />
            {tabular()}
            {createdForm()}
        </ProtectedRoute>
    )
}

export default Roles