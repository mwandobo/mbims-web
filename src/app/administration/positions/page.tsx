"use client"

import ProtectedRoute from '@/components/authentication/protected-route'
import PageHeader from '@/components/header/page-header'
import React from 'react'
import {usePageDataHook} from "@/hooks/page-render-hooks/use-page-data.hook";

interface Props {
    parent_id?: string
    subHeader?: string
}

function Position({
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
            layout: 'column'
        },
        {
            name: 'department_id',
            type: 'select',
            label: 'Department',
            value: '',
            optionsUrlData: `/fetch-data/departments`,
            optionDataKey: 'name',
            required: true,
            isError: false,
            errorMessage: '',
            layout: 'column'
        },
        {
            name: 'description',
            type: 'textArea',
            label: 'Name',
            value: '',
            required: true,
            isError: false,
            errorMessage: '',
            layout: 'column'
        },

    ]
    const _columns = [
        {
            id: 'name',
            numeric: false,
            disablePadding: false,
            label: 'Position Name',
        },
        {
            id: 'departmentName',
            numeric: false,
            disablePadding: false,
            label: 'Department',
        },
        {
            id: 'description',
            numeric: false,
            disablePadding: false,
            label: 'Description',
        },
    ]

    const permission = 'position'
    const url = `/positions`

    const {
        loading,
        createdForm,
        handleClick,
        tabular,
    } = usePageDataHook({
        columns: _columns,
        formInputs: _deptFormInputs,
        url: url,
        modalTitle: 'Position',
        viewUrl: '/administration/positions/',
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
                links={[{name: 'Positions / List', linkTo: '/administration/positions', permission: ''}]}
                subHeader={subHeader}
                permission={`${permission}_create`}
            />
            {tabular()}
            {createdForm('sm')}
        </ProtectedRoute>
    )
}

export default Position