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
        label: 'Department Name',
        width: '30%',

    },
    {
        id: 'description',
        numeric: false,
        disablePadding: false,
        label: 'Description',
        width: '64%',
    },
]

function AssetCategory() {
    const permission = 'asset_category'

    const {
        loading,
        createdForm,
        handleClick,
        tabular

    } = usePageDataHook({
        columns: columns,
        formInputs: deptFormInputs,
        url: 'asset-categories',
        modalTitle: 'Department',
        viewUrl: '/asset-management/asset-category/',
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
                        name: 'Asset Management / List',
                        linkTo: '/asset-management/asset-category',
                        permission: permission,
                        isClickable: true
                    },
                ]}/>
            {tabular()}
            {createdForm()}

        </ProtectedRoute>
    )
}

export default AssetCategory