"use client"

import ProtectedRoute from '@/components/authentication/protected-route'
import PageHeader from '@/components/header/page-header'
import React from 'react'
import {usePageDataHook} from "@/hooks/page-render-hooks/use-page-data.hook";
import {checkPermissions} from "@/utils/check-permissions";
function Project() {
    const permission = 'projects'

    const projectInputs = [
        {
            name: 'name',
            type: 'text',
            label: 'Name',
            value: '',
            required: true,
            isError: false,
            errorMessage: ''
        },
        {
            name: 'owner',
            type: 'text',
            label: 'Owner',
            value: '',
            required: true,
            isError: false,
            errorMessage: ''
        },
        {
            name: 'type_id',
            type: 'select',
            label: `Project Pillar`,
            value: '',
            optionsUrlData: `settings?group=project`,
            optionDataKey: 'departments',
            required: true,
            isError: false,
            errorMessage: '',
            control_for: ''
        },
        {
            name: 'communication_channel_ids',
            type: 'multi-select',
            label: `Communication Channel`,
            value: '',
            optionsUrlData: `settings?group=communication_channel`,
            optionDataKey: 'departments',
            required: true,
            isError: false,
            errorMessage: '',
            control_for: ''
        },

        {
            name: 'start_date',
            type: 'date',
            label: 'Start Date',
            value: '',
            required: true,
            isError: false,
            errorMessage: ''
        },
        {
            name: 'end_date',
            type: 'date',
            label: 'End Date',
            value: '',
            required: true,
            isError: false,
            errorMessage: ''
        },
        {
            name: 'location',
            type: 'text',
            label: 'Location',
            value: '',
            required: true,
            isError: false,
            errorMessage: ''
        },

        {
            name: 'prepared_by',
            type: 'text',
            label: 'Prepared By',
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
            name: 'summary',
            type: 'textArea',
            label: 'Summary',
            value: '',
            required: true,
            isError: false,
            errorMessage: ''
        },
        {
            name: 'purpose',
            type: 'textArea',
            label: 'Purpose',
            value: '',
            required: true,
            isError: false,
            errorMessage: ''
        },
        {
            name: 'scope',
            type: 'textArea',
            label: 'Scope',
            value: '',
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
                                {createdForm('lg')}
                            </>
                    }
                </>
            }
            </>
        </ProtectedRoute>
    )
}

export default Project