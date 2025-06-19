"use client"

import ProtectedRoute from '@/components/authentication/protected-route'
import PageHeader from '@/components/header/page-header'
import React from 'react'
import {usePageDataHook} from "@/hooks/page-render-hooks/use-page-data.hook";
import {checkPermissions} from "@/utils/check-permissions";

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
            required: true,
            isError: false,
            errorMessage: ''
        },
        {
            name: 'middleName',
            type: 'text',
            label: 'Middle Name',
            value: '',
            required: true,
            isError: false,
            errorMessage: ''
        },
        {
            name: 'lastName',
            type: 'text',
            label: 'Last Name',
            value: '',
            required: true,
            isError: false,
            errorMessage: ''
        },
        {
            name: 'phone',
            type: 'text',
            label: 'Phone',
            value: '',
            required: true,
            isError: false,
            errorMessage: ''
        },
        {
            name: 'email',
            type: 'text',
            label: 'Email',
            value: '',
            required: true,
            isError: false,
            errorMessage: ''
        },
        {
            name: 'department_id',
            type: 'select',
            label: 'Department',
            value: parent_id,
            optionsUrlData: `/departments`,
            optionDataKey: 'name',
            required: true,
            isError: false,
            errorMessage: ''
        },
        {
            name: 'role_id',
            type: 'select',
            label: 'Role',
            value: parent_id,
            optionsUrlData: `/role`,
            optionDataKey: 'name',
            required: true,
            isError: false,
            errorMessage: ''
        },
        {
            name: 'd_o_b',
            type: 'date',
            label: 'Date of Birth',
            value: '',
            required: true,
            isError: false,
            errorMessage: ''
        }
    ]
    const _columns = [
        {
            id: 'fullName',
            numeric: false,
            disablePadding: false,
            label: 'Employee Name',
        },
        {
            id: 'phone',
            numeric: false,
            disablePadding: false,
            label: 'Phone',
        },
        {
            id: 'email',
            numeric: false,
            disablePadding: false,
            label: 'Email',
        },
        {
            id: 'formatted_d_o_b',
            numeric: false,
            disablePadding: false,
            label: 'Date Of Birth',
        },
        {
            id: 'department',
            numeric: false,
            disablePadding: false,
            label: 'Department',
        },
        {
            id: 'role',
            numeric: false,
            disablePadding: false,
            label: 'Role',
        },
    ]

    const permission = 'employees'
    const url = `/users`

    const {
        loading,
        createdForm,
        handleClick,
        tabular,
    } = usePageDataHook({
        columns: _columns,
        formInputs: _deptFormInputs,
        url: url,
        modalTitle: 'Employee',
        viewUrl: '/administration/employees/',
        state_properties: [],
        permission: permission,
        emailNotificationBody: { code: 'create-employee', operation: null, id: null },
        isApiV2:true,
        isMaintainViewNavigationForV1:true
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
                                    links={[{ name: 'Employees / List', linkTo: '/administration/employees', permission: '' }]}
                                    subHeader={subHeader}

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

export default Employees