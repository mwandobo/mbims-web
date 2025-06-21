"use client"

import ProtectedRoute from '@/components/authentication/protected-route'
import PageHeader from '@/components/header/page-header'
import React from 'react'
import {usePageDataHook} from "@/hooks/page-render-hooks/use-page-data.hook";
import {checkPermissions} from "@/utils/check-permissions";
function Contract() {
    const permission = 'projects'

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
            name: 'service_request_type',
            type: 'select-local',
            label: 'Select Group',
            value: '',
            optionsUrlData: [{label: 'Suppliers', value: 'supplier'},{label: 'Clients', value: 'external'},{label: 'Others', value: 'others'}],
            optionDataKey: 'departments',
            required: true,
            isError: false,
            errorMessage: '',
            control_for: '',
        },
        {
            name: 'supplier_id',
            type: 'select',
            label: `Select Supplier`,
            value: '',
            optionsUrlData: `suppliers`,
            optionDataKey: 'name',
            required: true,
            isError: false,
            errorMessage: '',
            control_for: ''
        },
        {
            name: 'client_id',
            type: 'select',
            label: `Select Client`,
            value: '',
            optionsUrlData: `clients`,
            optionDataKey: 'name',
            required: true,
            isError: false,
            errorMessage: '',
            control_for: ''
        },
        {
            name: 'department_id',
            type: 'select',
            label: `Select Department`,
            value: '',
            optionsUrlData: `departments`,
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
            id: 'title',
            numeric: false,
            disablePadding: false,
            label: 'Contract Title',
        },
        {
            id: 'supplierName',
            numeric: false,
            disablePadding: false,
            label: 'Supplier',
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
        isApiV2: true
    })
    return (
        <ProtectedRoute>
            <>{
                !checkPermissions(`${permission}-list`) ? <p>You are not authorized</p> : <>
                    {
                        loading ? <p>Loading...</p>
                            :
                            <>
                                <PageHeader
                                    handleClick={handleClick}
                                    links={[{ name: 'Contracts / List', linkTo: '/contracts', permission: '' }]}
                                />
                                {tabular()}
                                {createdForm('md')}
                            </>
                    }
                </>
            }
            </>
        </ProtectedRoute>
    )
}

export default Contract