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
            name: 'name',
            type: 'text',
            label: 'Name',
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
            optionsUrlData: `/fetch-data/departments`,
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
            optionsUrlData: `/fetch-data/roles`,
            optionDataKey: 'name',
            required: true,
            isError: false,
            errorMessage: ''
        },
    ]
    const _columns = [
        {
            id: 'name',
            numeric: false,
            disablePadding: false,
            label: 'Employee Name',
        },
        {
            id: 'email',
            numeric: false,
            disablePadding: false,
            label: 'Email',
        },
        {
            id: 'departmentName',
            numeric: false,
            disablePadding: false,
            label: 'Department',
        },
        {
            id: 'roleName',
            numeric: false,
            disablePadding: false,
            label: 'Role',
        },
    ]

    const permission = 'employee'
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
                !checkPermissions(`${permission}_read`) ? <p>You are not authorized</p> : <>
                    {
                        loading ? <p>Loading...</p>
                            :
                            <>
                                <PageHeader
                                    handleClick={handleClick}
                                    isHideAdd={true}
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