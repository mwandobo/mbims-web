"use client"

import ProtectedRoute from '@/components/authentication/protected-route'
import PageHeader from '@/components/header/page-header'
import React from 'react'
import {usePageDataHook} from "@/hooks/page-render-hooks/use-page-data.hook";
import SubContractView from "@/app/contracts/fragments/sub-contract-view";

interface Props {
    from_id?: any
    project: any
    from?: any
    isHideAdd?: boolean
}

function SubContract({
    from_id,
    project,
    from,
    isHideAdd
}: Props) {

    const formInputs = [
        {
            name: 'assignment_type_id',
            type: 'select',
            label: `Select Type of Assignment`,
            value: '',
            optionsUrlData: `settings?group=assignment`,
            optionDataKey: 'departments',
            required: true,
            isError: false,
            errorMessage: '',
            control_for: 'assignment'
        },
        {
            name: 'personnel_id',
            type: 'select',
            label: `Select Personnel`,
            value: '',
            optionsUrlData: `/employee`,
            optionDataKey: 'users',
            required: true,
            isError: false,
            isRemoved: true,
            errorMessage: ''
        },
        {
            name: 'dept_id',
            type: 'select',
            label: `Select Department`,
            value: '',
            optionsUrlData: `department`,
            optionDataKey: 'departments',
            required: true,
            isError: false,
            isRemoved: true,
            errorMessage: ''
        },
        {
            name: 'start_date',
            type: 'date',
            label: 'Start Date',
            value: '',
            required: true,
            isError: false,
            minDate: project?.start_date,
            maxDate: project?.end_date,
            errorMessage: ''
        },
        {
            name: 'end_date',
            type: 'date',
            label: 'End Date',
            value: '',
            required: true,
            isError: false,
            minDate: project?.start_date,
            maxDate: project?.end_date,
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
        }
    ]

    const columns = [
        {
            id: 'personnel_department',
            numeric: false,
            disablePadding: false,
            label: 'Personnel/Department',
        },
        {
            id: 'description',
            numeric: false,
            disablePadding: false,
            label: 'Description',
        },
        {
            id: 'formatted_start_date',
            numeric: false,
            disablePadding: false,
            label: 'Start Date',
        },
        {
            id: 'formatted_end_date',
            numeric: false,
            disablePadding: false,
            label: 'End Date',
        },
    ]

    const url = ``

    const {
        loading,
        createdForm,
        handleClick,
        tabular

    } = usePageDataHook({
        columns: columns,
        formInputs: formInputs,
        url: url,
        modalTitle: 'Assignment',
        viewUrl: '',
        state_properties: [],
        isHideShow: false,
        isApiV2: true,
        sliderComponent:SubContractView
    })

    return (
        <ProtectedRoute>
            {
                loading ? <p>Loading...</p>
                    :
                    <>
                        <PageHeader
                            handleClick={handleClick}
                            subHeader='Sub Contracts / List'
                            links={[{ name: 'Sub Contracts', linkTo: `/contracts/` }]}
                            isHideAdd={isHideAdd}
                        />

                        {tabular()}
                        {createdForm()}
                    </>
            }
        </ProtectedRoute>
    )
}

export default SubContract