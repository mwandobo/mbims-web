"use client"

import ProtectedRoute from '@/components/authentication/protected-route'
import PageHeader from '@/components/header/page-header'
import React, {JSX} from 'react'
import {usePageDataHook} from "@/hooks/page-render-hooks/use-page-data.hook";
import ApprovalLevelView from "@/app/administration/approvals/components/approval-level-view";

const formInputs = [
    {
        name: 'name',
        type: 'text',
        label: 'Level Name',
        layout: 'column',
        value: '',
        required: true,
        isError: false,
        errorMessage: ''
    },
    {
        name: 'roleId',
        type: 'select',
        label: 'Roles',
        value: '',
        optionsUrlData:"fetch-data/roles",
        optionDataKey: 'name',
        required: true,
        isError: false,
        errorMessage: '',
        layout: 'column'
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
]

const columns = [
    {
        id: 'name',
        numeric: false,
        disablePadding: false,
        label: 'Level Name',
    },
    {
        id: 'formattedLevel',
        numeric: false,
        disablePadding: false,
        label: 'Level',
    },
    {
        id: 'roleName',
        numeric: false,
        disablePadding: false,
        label: 'Role',
    },

]

interface Props {
    id?: string,
    permission: string,
}

function ApprovalLevel({id, permission}: Props) {
    const url = `/approval-levels?userApprovalId=${id}`
    const {
        loading,
        createdForm,
        handleClick,
        tabular

    } = usePageDataHook({
        columns,
        formInputs,
        url,
        modalTitle: 'Approval Level',
        viewUrl: '',
        state_properties: [],
        permission: permission,
        isApiV2: true,
        sliderComponent:ApprovalLevelView,
    })

    return (
        <ProtectedRoute
            permission={`${permission}_read`}
            isLoading={loading}
        >
            <PageHeader
                handleClick={handleClick}
                permission={`${permission}_create`}
                subHeader={"Approval Level"}
                isHideAdd={false}
            />
            {tabular()}
            {createdForm( 'xs')}

        </ProtectedRoute>
    )
}

export default ApprovalLevel