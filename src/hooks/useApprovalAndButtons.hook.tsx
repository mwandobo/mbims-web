"use client"

import React, {ReactNode, useEffect, useState} from 'react';
import Swal from "sweetalert2";
import {useGlobalContextHook} from "@/hooks/useGlobalContextHook";
import SlideOver from "@/components/slide-over/slide-over.component";
import TreeList from "@/components/list/tree-list.component";
import {getValueFromLocalStorage, setValueLocalStorage} from "@/utils/local-storage.util";
import {getRequest, postRequest} from "@/utils/api-calls.util";
import {ButtonComponent} from "@/components/button/button.component";
import CrudFormComponent from "@/components/forms/crud-form.component";
import {capitalizeFirstWord} from "@/utils/string-manipulations";

interface Props {
    approval_slug?: string;
    from: string;
    from_id: string;
    parent?: string;
    approvalStatus?: string;
    hasApprovalMode?: boolean;
    isMyLevelApproved?: boolean;
    shouldApprove?: boolean;
    currentLevelId?: string;
    entityId?: string;
}

export const useApprovalsAndButtonsHook = ({
                                               approval_slug,
                                               from,
                                               from_id,
                                               parent,
                                               hasApprovalMode,
                                               approvalStatus,
                                               entityId,
    shouldApprove,
    isMyLevelApproved,
    currentLevelId
                                           }: Props) => {
    const [isNeedApprove, setIsNeedApprove] = useState(false);
    const [isApproved, setIsApproved] = useState(false);
    const [canApprove, setCanApprove] = useState(false);
    const [isLastLevel, setIsLastLevel] = useState(false);
    const [refresh, setIsrefresh] = useState(false);
    const [approveStatus, setApproveStatus] = useState('');
    const [latestApproveStatus, setLatestApproveStatus] = useState('');
    const {dispatch, state} = useGlobalContextHook()
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [remark, setRemark] = useState('');

    useEffect(() => {

    }, []);

    interface ApproveProps {
        approval_name?: string;
        from: string;
        from_id: string;
        remark?: string;
        approval_level_id?: string;
        type?: string;
    }

    console.log('entityId', entityId);
    console.log('currentLevelId', currentLevelId);

    const approve = async () => {
        const approveUrl = 'approval-actions';

        console.log('entityId', entityId);
        console.log('currentLevelId', currentLevelId);
       const payload = {
            action: modalTitle === "approve" ? "APPROVED" : "REJECTED",
            entityId: entityId ?? "",
            description: remark,
            approvalLevelId:currentLevelId ?? "",
        }

        const response = await postRequest(approveUrl, payload);
        if ([200, 201].includes(response.status)) {
            setIsrefresh(!refresh); // Trigger a re-render by toggling the refresh state
            dispatch({type: "UPDATE_VIEW_ITEM_REFRESH_AFTER_APPROVAL"})
        }
        return response;
    };

    const callBack = () => {
        setIsrefresh(prev => !prev); // Trigger a re-render by toggling the refresh state
        return null;
    };

    const handleApproval = (type: string) => {
        setModalTitle(type);
        setIsModalOpen(true);
    }

    const onCloseModal = () => {
        setIsModalOpen(false);
    }

    const handleInputChange = (e: any) => {
        setRemark(e?.target?.value);
    }

    const handleSubmit = async () => {
        const response = await approve();
        if (response && response.status === 200) {
            setIsModalOpen(false);
            setRemark('');
            callBack();

            await Swal.fire({
                title: `${modalTitle}`,
                text: `${modalTitle} successfully`,
                icon: "success"
            });
        }
    }

    const renderApprovalStatus = (approvalStatus: string) => {
        if (approvalStatus && approvalStatus === 'PENDING') {
            if(!shouldApprove){
                return <div className={"flex w-full justify-between"}>
                    <p className={'w-full'}> <span className='text-xs p-1 bg-gray-200 '>Waiting For Approval</span> </p>
                    <p className={'flex w-full justify-end'}> <span className='text-xs p-1 bg-gray-200 '>Waiting For Complete Approval</span> </p>
                </div>
            }

            if(!isMyLevelApproved){
                return <div className={"flex w-full justify-between"}>
                    <p className={'w-full'}>
                        <span className='text-xs p-1 bg-gray-200 '>Waiting For Your Approval</span>
                    </p>
                    {renderApprovalButtons()}
                </div>
            }

            return <div className={"flex w-full justify-between"}>
                <p className={'w-full'}><span className='text-xs p-1 bg-gray-200 '>Approved</span></p>
                {/*{renderApprovalButtons()}*/}
                <p className={'w-full flex justify-end'}>  <span className='text-xs p-1 bg-gray-200 '>Waiting For Further Approval</span> </p>
            </div>
        }

        switch (approvalStatus) {
            case 'APPROVED':
                return <span className='bg-green-100 p-2 rounded-sm'>Approved</span>
            case 'DISAPPROVED':
                return <span className='bg-red-100 p-2 rounded-sm'>Disapproved</span>
            default:
                return <span className='text-xs p-1 bg-gray-200'>Waiting For Approval</span>
        }
    }

    const renderApprovalButtons = () => {
        return <div className='flex w-full gap-2 justify-end items-end mt-1'>
            <ButtonComponent
                name='Approve'
                onClick={() => handleApproval('approve')}
                rounded={'md'}
                padding={'p-3'}
                shadow={'shadow-md'}
                bg_color={'bg-gray-50'}
                hover={'hover:bg-gray-200 hover:border-gray-400'}
                hover_text={'hover:text-gray-900 hover:font-semibold'}
                border={'border border-gray-300'}
                text_color={'text-gray-700'}
            />
            <ButtonComponent
                name='DisApprove'
                onClick={() => handleApproval('disapprove')}
                rounded={'md'}
                padding={'p-3'}
                shadow={'shadow-md'}
                bg_color={'bg-gray-50'}
                hover={'hover:bg-gray-200 hover:border-gray-400'}
                hover_text={'hover:text-gray-900 hover:font-semibold'}
                border={'border border-gray-300'}
                text_color={'text-gray-700'}
            />
            <CrudFormComponent
                isModalOpen={isModalOpen}
                onCloseModal={onCloseModal}
                handleSubmit={handleSubmit}
                formInputs={[
                    {
                        name: 'remark',
                        type: 'textArea',
                        label: 'Remark',
                        value: remark,
                        required: true,
                        isError: false,
                        errorMessage: ''
                    }
                ]}
                modalTitle={capitalizeFirstWord(modalTitle)}
                isForm={true}
                handleInputChange={handleInputChange}
                onSaveButtonName={'Proceed'}
            />
        </div>

    }

    const approval_url = `approval/approved-items/by-item?from=${from}&&from_id=${from_id}`

    interface ApprovalsAndButtonsProps {
        buttonBody?: ReactNode,
    }


    const approvalsAndButtonsWrapper = ({buttonBody}: ApprovalsAndButtonsProps) => {
        return (
            <>
                {hasApprovalMode ? (
                    <div className={'flex flex-col md:flex-row md:justify-between md: gap-2 w-full items-end'}>
                        {
                            approvalStatus ? renderApprovalStatus(approvalStatus) : renderApprovalButtons()
                        }
                        {
                            approvalStatus === "APPROVED" && buttonBody
                        }
                    </div>
                ) : buttonBody
                }
            </>
        );
    }

    return {
        isApproved,
        canApprove,
        isNeedApprove,
        approve,
        callBack,
        isLastLevel,
        approveStatus,
        isMyLevelApproved,
        latestApproveStatus,
        approvalsAndButtonsWrapper,
        refresh
    };
};