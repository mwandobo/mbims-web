"use client"

import ProtectedRoute from '@/components/authentication/protected-route'
import PageHeader from '@/components/header/page-header'
import React from 'react'
import {usePageDataHook} from "@/hooks/page-render-hooks/use-page-data.hook";


const columns = [
    {
        id: 'activity',
        numeric: false,
        disablePadding: false,
        label: 'Activity',
        width: '60%',
    },
    {
        id: 'createdAt',
        numeric: false,
        disablePadding: false,
        label: 'Date',
    },
    {
        id: 'user',
        numeric: false,
        disablePadding: false,
        label: 'User',
    },
]

function Roles() {

    const permission = 'activity_logs'

    const {
        loading,
        createdForm,
        handleClick,
        tabular

    } = usePageDataHook({
        columns: columns,
        url: 'activity-logs',
        modalTitle: 'Role',
        viewUrl: '/administration/roles/',
        state_properties: [],
        show_assign: true,
        isApiV2: true,
        isMaintainViewNavigationForV1: true,
        permission: permission,
        isHideActions:true
    })

    return (
        <ProtectedRoute
            permission={`${permission}_read`}
            isLoading={loading}
        >
            <PageHeader
                handleClick={handleClick}
                links={[{name: 'Recent Activities / List', linkTo: '/role', permission: ''}]}
                permission={`${permission}_create`}
                isHideAdd={true}
            />
            {tabular()}
            {createdForm()}
        </ProtectedRoute>
    )
}

export default Roles