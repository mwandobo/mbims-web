"use client"

import ProtectedRoute from '@/components/authentication/protected-route'
import PageHeader from '@/components/header/page-header'
import React from 'react'
import {usePageDataHook} from "@/hooks/page-render-hooks/use-page-data.hook";

interface Props {
    parent_id?: string
    subHeader?: string
}

function Reconciliation({
                       parent_id,
                       subHeader
                   }: Props) {

    const _deptFormInputs = []
    const _columns = [
        {
            id: 'code',
            numeric: false,
            disablePadding: false,
            label: 'Reconciliation Code',
        },
        {
            id: 'createdAt',
            numeric: false,
            disablePadding: false,
            label: 'Reconciliation Date',
        },
          {
            id: 'staffName',
            numeric: false,
            disablePadding: false,
            label: 'Staff Name',
        },
         {
            id: 'status',
            numeric: false,
            disablePadding: false,
            label: 'Reconciliation Status',
        },
 
    ]

    const permission = 'reconciliation'
    const url = `reconciliations`

    const {
        loading,
        createdForm,
        handleClick,
        tabular,
    } = usePageDataHook({
        columns: _columns,
        formInputs: _deptFormInputs,
        url: url,
        modalTitle: 'Reconciliation',
        viewUrl: '/reconciliation',
        state_properties: [],
        permission: permission,
        isApiV2: true,
        isMaintainViewNavigationForV1: true,
        isHideDelete: true,
    })
    return (
        <ProtectedRoute
            permission={`${permission}_read`}
            isLoading={loading}
        >
            <PageHeader
                handleClick={handleClick}
                isHideAdd={false}
                links={[{name: 'Reconciliation / List', linkTo: '/reconciliation', permission: ''}]}
                subHeader={subHeader}
                permission={`${permission}_create`}
                pageTitle={'recon'}
            />
            {tabular()}
            {createdForm('md')}
        </ProtectedRoute>
    )
}

export default Reconciliation