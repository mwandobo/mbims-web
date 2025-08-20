"use client"

import ProtectedRoute from '@/components/authentication/protected-route'
import PageHeader from '@/components/header/page-header'
import React from 'react'
import {usePageDataHook} from "@/hooks/page-render-hooks/use-page-data.hook";

function Policy() {
    const permission = 'policy'

    const projectInputs = [
        {
            name: 'title',
            type: 'text',
            label: "Policy Title",
            value: '',
            required: true,
            isError: false,
            errorMessage: ''
        },
        {
            name: 'owner',
            type: 'text',
            label: "Policy Owner",
            value: '',
            required: true,
            isError: false,
            errorMessage: ''
        },
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
            name: 'approvalDate',
            type: 'date',
            label: 'Approval Date',
            value: '',
            required: true,
            isError: false,
            errorMessage: ''
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
        {
            name: 'nextRenewalDate',
            type: 'date',
            label: 'Next Renewal Date',
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
            label: 'Policy Title',
        },
        {
            id: 'owner',
            numeric: false,
            disablePadding: false,
            label: 'Policy Owner',
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
            id: 'approvalDate',
            type: 'date',
            label: 'Approval Date',
            value: '',
            required: true,
            isError: false,
            errorMessage: ''
        },
        {
            id: 'issuanceDate',
            numeric: false,
            disablePadding: false,
            label: 'Issuance Date',
        },
        {
            id: 'nextRenewalDate',
            numeric: false,
            disablePadding: false,
            label: 'Next Renewal Date',
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
        url: 'policies',
        modalTitle: 'Policies',
        viewUrl: '/policy/',
        state_properties: [],
        permission: permission,
        from: "policies",
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
                links={[{name: 'Policies / List', linkTo: '/policies', permission: ''}]}
                permission={`${permission}_create`}
            />
            {tabular()}
            {createdForm('md')}

        </ProtectedRoute>
    )
}

export default Policy