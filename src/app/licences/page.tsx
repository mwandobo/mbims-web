"use client"

import ProtectedRoute from '@/components/authentication/protected-route'
import PageHeader from '@/components/header/page-header'
import React from 'react'
import {usePageDataHook} from "@/hooks/page-render-hooks/use-page-data.hook";

function Contract() {
    const permission = 'licence'

    const projectInputs = [
        {
            name: 'title',
            type: 'text',
            label: "Licence Title",
            value: '',
            required: true,
            isError: false,
            errorMessage: ''
        },

        {
            name: 'typeOfBusiness',
            type: 'text',
            label: 'Type Of Business',
            value: '',
            required: true,
            isError: false,
            errorMessage: ''
        },
        {
            name: 'licenceNumber',
            type: 'text',
            label: 'Licence Number',
            value: '',
            required: true,
            isError: false,
            errorMessage: ''
        },
        {
            name: 'operatorName',
            type: 'text',
            label: 'Operator Name',
            value: '',
            required: true,
            isError: false,
            errorMessage: ''
        },


        // {
        //     name: 'supplier_id',
        //     type: 'select',
        //     label: `Select Supplier`,
        //     value: '',
        //     optionsUrlData: `fetch-data/suppliers`,
        //     optionDataKey: 'name',
        //     required: true,
        //     isError: false,
        //     errorMessage: '',
        //     controlled_by: 'contract-group',
        //     control: 'supplier'
        // },
        {
            name: 'department_id',
            type: 'select',
            label: `Select Department`,
            value: '',
            optionsUrlData: `fetch-data/departments`,
            optionDataKey: 'name',
            required: true,
            isError: false,
            errorMessage: '',
            control_for: ''
        },
        {
            name: 'issuanceDate',
            type: 'date',
            label: 'Issuance Date',
            value: '',
            required: true,
            isError: false,
            errorMessage: ''
        },
        // {
        //     name: 'endDate',
        //     type: 'date',
        //     label: 'End Date',
        //     value: '',
        //     required: true,
        //     isError: false,
        //     errorMessage: ''
        // },
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

    const _columns = [
        {
            id: 'reference_no',
            numeric: false,
            disablePadding: false,
            label: 'Serial No',
        },
        {
            id: 'title',
            numeric: false,
            disablePadding: false,
            label: 'Licence Title',
        },
        {
            id: 'typeOfBusiness',
            numeric: false,
            disablePadding: false,
            label: 'Type Of Business',
        },
        {
            id: 'licenceNumber',
            label: 'Licence Number',
            value: '',
            required: true,
            isError: false,
            errorMessage: ''
        },
        {
            id: 'operatorName',
            label: 'Operator Name',
            value: '',
            required: true,
            isError: false,
            errorMessage: ''
        },
        {
            id: 'departmentName',
            label: 'Department',
            value: '',
            required: true,
            isError: false,
            errorMessage: ''
        },
        {
            id: 'issuanceDate',
            type: 'date',
            label: 'Issuance Date',
            value: '',
            required: true,
            isError: false,
            errorMessage: ''
        },
        {
            id: 'status',
            numeric: false,
            disablePadding: false,
            label: 'Status',
        },
    ]

    const {
        loading,
        createdForm,
        handleClick,
        tabular,
    } = usePageDataHook({
        columns: _columns,
        formInputs: projectInputs,
        url: 'licences',
        modalTitle: 'Licence',
        viewUrl: '/licences/',
        state_properties: [],
        permission: permission,
        from: "licences",
        isApiV2: true,
        isFormData: true,
        isMaintainViewNavigationForV1: true
    })
    return (
        <ProtectedRoute
            permission={`${permission}_read`}
            isLoading={loading}
        >
            <PageHeader
                handleClick={handleClick}
                links={[{name: 'Licence / List', linkTo: '/licence', permission: ''}]}
                permission={`${permission}_create`}
            />
            {tabular()}
            {createdForm('md')}

        </ProtectedRoute>
    )
}

export default Contract