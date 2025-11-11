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
            label: 'Name',
            value: '',
            required: true,
            isError: false,
            errorMessage: '',
            layout: 'column',
        },
        {
            name: 'category_id',
            type: 'select',
            label: 'Asset Category',
            value: '',
            optionsUrlData: `/fetch-data/asset-categories`,
            optionDataKey: 'name',
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
            required: true,
            isError: false,
            errorMessage: '',
            layout: 'column',
        },

    ]
    const _columns = [
        {
            id: 'name',
            numeric: false,
            disablePadding: false,
            label: 'Asset Name',
        },
        {
            id: 'categoryName',
            numeric: false,
            disablePadding: false,
            label: 'Category',
        },
        {
            id: 'description',
            numeric: false,
            disablePadding: false,
            label: 'Description',
        },
    ]

    const permission = 'asset'
    const url = `/assets`

    const {
        loading,
        createdForm,
        handleClick,
        tabular,
    } = usePageDataHook({
        columns: _columns,
        formInputs: _deptFormInputs,
        url: url,
        modalTitle: 'Assets',
        viewUrl: '/asset-management/asset/',
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
                links={[{name: 'Asset Management / Assets / List', linkTo: '/asset-management/asset', permission: ''}]}
                subHeader={subHeader}
                permission={`${permission}_create`}
            />
            {tabular()}
            {createdForm('sm')}
        </ProtectedRoute>
    )
}

export default Asset