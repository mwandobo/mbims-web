"use client"

import ProtectedRoute from '@/components/authentication/protected-route'
import PageHeader from '@/components/header/page-header'
import React from 'react'
import {usePageDataHook} from "@/hooks/page-render-hooks/use-page-data.hook";
import NotificationSettings from "@/app/settings/components/notification-settings.component";

function Contract() {
    const permission = 'contract'

    const projectInputs = [
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
            name: 'group',
            type: 'select-local',
            label: 'Select Group',
            value: '',
            optionsUrlData: [{label: 'Suppliers', value: 'supplier'}, {label: 'Clients', value: 'client'}],
            optionDataKey: 'departments',
            required: true,
            isError: false,
            errorMessage: '',
            control_for: 'contract-group',
            control_type: 'hide-show',
        },
        {
            name: 'supplier_id',
            type: 'select',
            label: `Select Supplier`,
            value: '',
            optionsUrlData: `fetch-data/suppliers`,
            optionDataKey: 'name',
            required: true,
            isError: false,
            isRemoved: true,
            errorMessage: '',
            controlled_by: 'contract-group',
            control: 'supplier'
        },
        {
            name: 'client_id',
            type: 'select',
            label: `Select Client`,
            value: '',
            optionsUrlData: `fetch-data/clients`,
            optionDataKey: 'name',
            required: true,
            isRemoved: true,
            isError: false,
            controlled_by: 'contract-group',
            errorMessage: '',
            control: 'client'
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
            name: 'startDate',
            type: 'date',
            label: 'Start Date',
            value: '',
            required: true,
            isError: false,
            errorMessage: ''
        },
        {
            name: 'endDate',
            type: 'date',
            label: 'End Date',
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
            label: 'Contract Title',
        },
        {
            id: 'amount',
            numeric: false,
            disablePadding: false,
            label: 'Amount',
        },
        {
            id: 'group',
            numeric: false,
            disablePadding: false,
            label: 'Contract Group',
        },
        {
            id: 'supplierName',
            numeric: false,
            disablePadding: false,
            label: 'Supplier/Client Name',
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
            id: 'startDate',
            type: 'date',
            label: 'Start Date',
            value: '',
            required: true,
            isError: false,
            errorMessage: ''
        },
        {
            id: 'endDate',
            numeric: false,
            disablePadding: false,
            label: 'End Date',
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
        url: 'contracts',
        modalTitle: 'Contract',
        viewUrl: '/contracts/',
        state_properties: [],
        permission: permission,
        from: "contracts",
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
                links={[{name: 'Settings ', linkTo: '/Settings', permission: ''}]}
                permission={`${permission}_create`}
            />

            <NotificationSettings />

        </ProtectedRoute>
    )
}

export default Contract