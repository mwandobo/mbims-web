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
            label: 'Supplier Name',
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
            name: 'dateOfBirth',
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
            id: 'name',
            numeric: false,
            disablePadding: false,
            label: 'Supplier Name',
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
            id: 'dateOfBirth',
            numeric: false,
            disablePadding: false,
            label: 'Date Of Birth',
        },
    ]

    const permission = 'supplier'
    const url = `/suppliers`

    const {
        loading,
        createdForm,
        handleClick,
        tabular,
    } = usePageDataHook({
        columns: _columns,
        formInputs: _deptFormInputs,
        url: url,
        modalTitle: 'Suppliers',
        viewUrl: '/administration/suppliers/',
        state_properties: [],
        permission: permission,
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
                                    links={[{ name: 'Suppliers / List', linkTo: '/administration/suppliers', permission: '' }]}
                                    subHeader={subHeader}

                                />
                                {tabular()}
                                {createdForm()}
                            </>
                    }
                </>
            }
            </>
        </ProtectedRoute>
    )
}

export default Employees