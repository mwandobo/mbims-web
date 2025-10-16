"use client"

import ProtectedRoute from '@/components/authentication/protected-route'
import PageHeader from '@/components/header/page-header'
import React from 'react'
import {usePageDataHook} from "@/hooks/page-render-hooks/use-page-data.hook";

interface Props {
    parent_id?: string
    subHeader?: string
}

function Asset({
                   parent_id,
                   subHeader
               }: Props) {

    const _deptFormInputs = [
        {
            name: 'name',
            type: 'text',
            label: 'Request Title',
            layout: 'column',
            value: '',
            required: true,
            isError: false,
            errorMessage: ''
        },
        {
            name: 'description',
            type: 'textArea',
            label: 'Description',
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
            label: 'Request Title',
        },
        {
            id: 'formattedCreatedAt',
            numeric: false,
            disablePadding: false,
            label: 'Date',
        },
        {
            id: 'createdBy',
            numeric: false,
            disablePadding: false,
            label: 'Requested By',
        },
        {
            id: 'status',
            numeric: false,
            disablePadding: false,
            label: 'Status',
        },
    ]

    const permission = 'asset_request'
    const url = `/asset-requests`

    const {
        loading,
        createdForm,
        handleClick,
        tabular,
    } = usePageDataHook({
        columns: _columns,
        formInputs: _deptFormInputs,
        url: url,
        modalTitle: 'Asset Request',
        viewUrl: '/asset-management/asset-request/',
        state_properties: [],
        permission: permission,
        isApiV2: true,
        isMaintainViewNavigationForV1: true,
        inputSize: ''
    })
    return (
        <ProtectedRoute
            permission={`${permission}_read`}
            isLoading={loading}
        >
            <PageHeader
                handleClick={handleClick}
                // isHideAdd={true}
                links={[{name: 'Asset Requests / List', linkTo: '/asset-management/asset-request', permission: ''}]}
                subHeader={subHeader}
                permission={`${permission}_create`}
            />
            {tabular()}
            {createdForm('sm')}
        </ProtectedRoute>
    )
}

export default Asset