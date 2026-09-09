"use client"

import ProtectedRoute from '@/components/authentication/protected-route'
import PageHeader from '@/components/header/page-header'
import React from 'react'
import {usePageDataHook} from "@/hooks/page-render-hooks/use-page-data.hook";

interface Props {
    parent_id?: string
    subHeader?: string
}

function Employees({
                       parent_id,
                       subHeader
                   }: Props) {

    const _deptFormInputs = [
        {
            name: 'firstName',
            type: 'text',
            label: 'First Name',
            value: '',
            required: false,
            isError: false,
            errorMessage: '',
            layout: 'column',
        },
        //middle name here
        {
            name: 'middleName',
            type: 'text',
            label: 'Middle Name',
            value: '',
            required: false,
            isError: false,
            errorMessage: '',
            layout: 'column',
        },
        {
            name: 'lastName',
            type: 'text',
            label: 'Last Name',
            value: '',
            required: false,
            isError: false,
            errorMessage: '',
            layout: 'column',
        },
        {
            name: 'email',
            type: 'text',
            label: 'Email',
            value: '',
            required: true,
            isError: false,
            errorMessage: '',
            layout: 'column',
        },
          {
            name: 'mobilePhone',
            type: 'text',
            label: 'Phone',
            value: '',
            required: false,
            isError: false,
            errorMessage: '',
            layout: 'column',
        },
        {
            name: 'departmentId',
            type: 'select',
            label: 'Department',
            value: '',
            optionsUrlData: `/fetch-data/departments`,
            optionDataKey: 'name',
            required: false,
            isError: false,
            errorMessage: '',
            layout: 'column',
        },
        {
            name: 'positionId',
            type: 'select',
            label: 'Position',
            value: '',
            optionsUrlData: `/fetch-data/positions`,
            optionDataKey: 'name',
            required: false,
            isError: false,
            errorMessage: '',
            layout: 'column',
        },
          {
            name: 'unitId',
            type: 'select',
            label: 'Unit',
            value: '',
            optionsUrlData: `/fetch-data/units`,
            optionDataKey: 'name',
            required: false,
            isError: false,
            errorMessage: '',
            layout: 'column',
        },

    ]
    const _columns = [
        {
            id: 'reconciliationCode',
            numeric: false,
            disablePadding: false,
            label: 'Reconciliation Code',
        },
        {
            id: 'createdAt',
            numeric: false,
            disablePadding: false,
            label: 'Reconciliation Date',
        },
          {
            id: 'staffName',
            numeric: false,
            disablePadding: false,
            label: 'Staff Name',
        },
         {
            id: 'reconciliationStatus',
            numeric: false,
            disablePadding: false,
            label: 'Reconciliation Status',
        },
 
    ]

    const permission = 'reconciliation'
    const url = `reconciliations`

    const {
        loading,
        createdForm,
        handleClick,
        tabular,
    } = usePageDataHook({
        columns: _columns,
        formInputs: _deptFormInputs,
        url: url,
        modalTitle: 'Reconciliation',
        viewUrl: '/reconciliation',
        state_properties: [],
        permission: permission,
        isApiV2: true,
        isMaintainViewNavigationForV1: true,
        isHideDelete: true,
    })
    return (
        <ProtectedRoute
            permission={`${permission}_read`}
            isLoading={loading}
        >
            <PageHeader
                handleClick={handleClick}
                isHideAdd={false}
                links={[{name: 'Reconciliation / List', linkTo: '/reconciliation', permission: ''}]}
                subHeader={subHeader}
                permission={`${permission}_create`}
                pageTitle={'recon'}
            />
            {tabular()}
            {createdForm('md')}
        </ProtectedRoute>
    )
}

export default Employees