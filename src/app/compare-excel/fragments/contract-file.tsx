"use client"

import ProtectedRoute from '@/components/authentication/protected-route'
import PageHeader from '@/components/header/page-header'
import React from 'react'
import {usePageDataHook} from "@/hooks/page-render-hooks/use-page-data.hook";
import ContractFileView from "@/app/contracts/fragments/contract-file-view";

interface Props {
    contract_id?: any
    isHideAdd?: boolean
}

function ContractFile({
                          contract_id,
                          isHideAdd
                      }: Props) {

    const formInputs = [
        {
            name: 'title',
            type: 'text',
            label: "File Title",
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
        {
            name: 'file',
            type: 'file',
            label: "Upload File",
            value: '',
            placeholder: "upload file",
            required: true,
            isError: false,
            errorMessage: ''
        },
    ]

    const columns = [
        {
            id: 'title',
            numeric: false,
            disablePadding: false,
            label: 'File Title',
        },
        {
            id: 'status',
            numeric: false,
            disablePadding: false,
            label: 'Status',
        },
    ]

    const url = `contracts/${contract_id}/files`
    const permission = 'contract_file'

    const {
        loading,
        createdForm,
        handleClick,
        tabular

    } = usePageDataHook({
        columns: columns,
        formInputs: formInputs,
        url: url,
        modalTitle: 'Contract File',
        viewUrl: '',
        state_properties: [],
        isHideShow: false,
        isApiV2: true,
        isFormData: true,
        sliderComponent: ContractFileView,
        permission
    })

    return (
        <ProtectedRoute
            permission={`${permission}_read`}
            isLoading={loading}
        >
            <PageHeader
                handleClick={handleClick}
                subHeader='Contract Files / List'
                links={[{name: 'Contract Files', linkTo: `/contracts/`}]}
                isHideAdd={isHideAdd}
                permission={`${permission}_create`}
            />

            {tabular()}
            {createdForm()}

        </ProtectedRoute>
    )
}

export default ContractFile