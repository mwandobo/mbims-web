"use client"

import ProtectedRoute from '@/components/authentication/protected-route'
import PageHeader from '@/components/header/page-header'
import React from 'react'
import {usePageDataHook} from "@/hooks/page-render-hooks/use-page-data.hook";
import SubContractView from "@/app/contracts/fragments/sub-contract-view";

interface Props {
    contract?: any
    isHideAdd?: boolean
}

function SubContract({
                         contract,
                         isHideAdd
                     }: Props) {

    const formInputs = [
        {
            name: 'title',
            type: 'text',
            label: "Contract Title",
            value: '',
            required: true,
            isError: false,
            errorMessage: ''
        },
        {
            name: 'amount',
            type: 'text',
            label: "Contract Amount",
            value: '',
            required: true,
            isError: false,
            errorMessage: ''
        },
        {
            name: 'startDate',
            type: 'date',
            label: 'Start Date',
            value: '',
            required: true,
            isError: false,
            errorMessage: '',
            minDate: contract?.startDate
        },
        {
            name: 'endDate',
            type: 'date',
            label: 'End Date',
            value: '',
            required: true,
            isError: false,
            errorMessage: '',
            maxDate: contract?.endDate

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
            label: 'Contract Title',
        },
        {
            id: 'amount',
            numeric: false,
            disablePadding: false,
            label: 'Amount',
        },
        {
            id: 'startDate',
            type: 'date',
            label: 'Start Date',
            value: '',
            required: true,
            isError: false,
            errorMessage: '',
            minDate: contract.startDate,
        },
        {
            id: 'endDate',
            numeric: false,
            disablePadding: false,
            label: 'End Date',
            maxDate: contract.endDate,
            required: true,
            isError: false,
            errorMessage: '',
        },
        {
            id: 'status',
            numeric: false,
            disablePadding: false,
            label: 'Status',
        },
    ]

    const url = `contracts/${contract?.id}/sub-contracts`

    const {
        loading,
        createdForm,
        handleClick,
        tabular

    } = usePageDataHook({
        columns: columns,
        formInputs: formInputs,
        url: url,
        modalTitle: 'Sub Contract',
        viewUrl: '',
        state_properties: [],
        isHideShow: false,
        isApiV2: true,
        isFormData: true,
        sliderComponent: SubContractView
    })

    return (
        <ProtectedRoute>
            {
                loading ? <p>Loading...</p>
                    :
                    <>
                        <PageHeader
                            handleClick={handleClick}
                            subHeader='Sub Contracts / List'
                            links={[{name: 'Sub Contracts', linkTo: `/contracts/`}]}
                            isHideAdd={isHideAdd}
                        />

                        {tabular()}
                        {createdForm()}
                    </>
            }
        </ProtectedRoute>
    )
}

export default SubContract