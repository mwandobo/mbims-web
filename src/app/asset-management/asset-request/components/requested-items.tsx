"use client"

import ProtectedRoute from '@/components/authentication/protected-route'
import PageHeader from '@/components/header/page-header'
import React, {JSX} from 'react'
import {usePageDataHook} from "@/hooks/page-render-hooks/use-page-data.hook";
import RequestedItemView from "@/app/asset-management/asset-request/components/requested-item-view";

const formInputs = [
    // {
    //     name: 'name',
    //     type: 'text',
    //     label: 'Name',
    //     value: '',
    //     required: true,
    //     isError: false,
    //     errorMessage: '',
    // },
    {
        name: 'category_id',
        type: 'select',
        label: 'Categories',
        value: '',
        optionsUrlData: "fetch-data/asset-categories",
        optionDataKey: 'name',
        required: true,
        isError: false,
        errorMessage: ''
    },
    // {
    //     name: 'description',
    //     type: 'textArea',
    //     label: 'Description',
    //     value: '',
    //     isError: false,
    //     errorMessage: ''
    // }
    {
        name: 'asset_ids',
        type: 'multi-select',
        label: 'Assets',
        value: '',
        optionsUrlData:"fetch-data/assets-by-categories",
        optionDataKey: 'name',
        required: true,
        isError: false,
        errorMessage: ''
    },
]

const columns = [
    {
        id: 'assetName',
        numeric: false,
        disablePadding: false,
        label: 'Asset Name',
    },
    {
        id: 'categoryName',
        numeric: false,
        disablePadding: false,
        label: 'Category Name',
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
        sliderComponent:RequestedItemView,
        isHideEdit: true
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
                isHideAdd={false}
            />
            {tabular()}
            {createdForm()}

        </ProtectedRoute>
    )
}

export default RequestedItems