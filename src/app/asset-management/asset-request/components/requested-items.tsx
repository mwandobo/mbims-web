"use client"

import ProtectedRoute from '@/components/authentication/protected-route'
import PageHeader from '@/components/header/page-header'
import React, {JSX} from 'react'
import {usePageDataHook} from "@/hooks/page-render-hooks/use-page-data.hook";
import RequestedItemView from "@/app/asset-management/asset-request/components/requested-item-view";

const formInputs = [
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
        id: 'assetName',
        numeric: false,
        disablePadding: false,
        label: 'Asset Name',
    },

]

interface Props {
    id?: string,
    permission: string,
}

function RequestedItems({id, permission}: Props) {
    const url = `/requested-assets?requestId=${id}`

    const {
        loading,
        createdForm,
        handleClick,
        tabular

    } = usePageDataHook({
        columns,
        formInputs,
        url,
        modalTitle: 'Requested Assets',
        viewUrl: '',
        state_properties: [],
        permission: permission,
        isApiV2: true,
        sliderComponent:RequestedItemView
    })

    return (
        <ProtectedRoute
            permission={`${permission}_read`}
            isLoading={loading}
        >
            <PageHeader
                handleClick={handleClick}
                permission={`${permission}_create`}
                subHeader={"Requested Assets"}
                isHideAdd={true}
            />
            {tabular()}
            {createdForm()}

        </ProtectedRoute>
    )
}

export default RequestedItems