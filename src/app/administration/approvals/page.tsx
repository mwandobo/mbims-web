"use client"

import ProtectedRoute from '@/components/authentication/protected-route'
import PageHeader from '@/components/header/page-header'
import React from 'react'
import {usePageDataHook} from "@/hooks/page-render-hooks/use-page-data.hook";

interface Props {
    parent_id?: string
    subHeader?: string
}

function Approval({
                       parent_id,
                       subHeader
                   }: Props) {

    const _deptFormInputs = [
        {
            name: 'name',
            type: 'text',
            label: 'Name',
            value: '',
            required: true,
            isError: false,
            layout: 'column',
            errorMessage: ''
        },
        {
            name: 'sysApprovalId',
            type: 'select',
            label: 'System Approval',
            value: '',
            optionsUrlData: `/fetch-data/sys-approvals`,
            optionDataKey: 'name',
            placeholder: 'Select System Approval',
            layout: 'column',
            required: true,
            isError: false,
            errorMessage: ''
        },
        {
            name: 'description',
            type: 'textArea',
            label: 'Name',
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
            label: 'Approval Name',
        },
        {
            id: 'sysApproval',
            numeric: false,
            disablePadding: false,
            label: 'System Approval',
        },
    ]

    const permission = 'approval'
    const url = `/user-approvals`

    const {
        loading,
        createdForm,
        handleClick,
        tabular,
    } = usePageDataHook({
        columns: _columns,
        formInputs: _deptFormInputs,
        url: url,
        modalTitle: 'Approval',
        viewUrl: '/administration/approvals/',
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
                // isHideAdd={true}
                links={[{name: 'Approval / List', linkTo: '/administration/approvals', permission: ''}]}
                subHeader={subHeader}
                permission={`${permission}_create`}
            />
            {tabular()}
            {createdForm('sm')}
        </ProtectedRoute>
    )
}

export default Approval