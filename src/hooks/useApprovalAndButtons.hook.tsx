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
    onAfterApprove?: () => Promise<void> | void; // ✅ new
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
                                               currentLevelId,
                                               onAfterApprove
                                           }: Props) => {
    // const {dispatch, state} = useGlobalContextHook()
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

    const approve = async () => {
        const approveUrl = 'approval-actions';

        const payload = {
            action: modalTitle === "approve" ? "APPROVED" : "REJECTED",
            entityId: entityId ?? "",
            description: remark,
            approvalLevelId: currentLevelId ?? "",
        }

        // const response = await postRequest(approveUrl, payload);
        // if ([200, 201].includes(response.status)) {
        //     setIsrefresh(!refresh); // Trigger a re-render by toggling the refresh state
        //     dispatch({type: "UPDATE_VIEW_ITEM_REFRESH_AFTER_APPROVAL"})
        // }
        return await postRequest(approveUrl, payload);
        ;
    };

    // const callBack = () => {
    //     setIsrefresh(prev => !prev); // Trigger a re-render by toggling the refresh state
    //     return null;
    // };

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

        if ([200, 201].includes(response.status)) {
            setIsModalOpen(false);
            setRemark('');
            await Swal.fire({
                title: `${modalTitle}`,
                text: `${modalTitle} successfully`,
                icon: "success"
            });

            if (typeof onAfterApprove === "function") {
                await onAfterApprove();
            }
        }
    }

    const renderTreeList = () => {
        return <div className={'flex justify-between ml-2 w-36'}>
            <SlideOver
                showButton={true}
                title="Approval Trail">
                <TreeList
                    searchKey={entityId}
                />
            </SlideOver>
        </div>
    }

    const renderApprovalStatus = (approvalStatus: string) => {
        if (approvalStatus && approvalStatus === 'PENDING') {
            if (!shouldApprove) {
                return <div className={"flex w-full justify-between mt-1"}>
                    <div className={"flex w-full justify-start"}>
                        <p className={''}><span className='text-xs p-2 bg-gray-200 '>Waiting For Approval</span>
                        </p>
                        {renderTreeList()}
                    </div>
                    <p className={'flex w-full justify-end'}><span className='text-xs p-1 bg-gray-200 '>Waiting For Complete Approval</span>
                    </p>
                </div>
            }

            if (!isMyLevelApproved) {
                return <div className={"flex w-full justify-between"}>
                    <div className={"flex w-full justify-start items-center"}>
                        <p className={''}>
                            <span className='text-xs p-2 bg-gray-200 '>Waiting For Your Approval</span>
                        </p>
                        {renderTreeList()}
                    </div>
                    {renderApprovalButtons()}
                </div>
            }

            return <div className={"flex w-full justify-between mt-1"}>
                <div className={"flex w-full justify-start"}>
                    <p className={''}><span className='text-xs p-2 bg-gray-200 '>Approved</span></p>
                    {renderTreeList()}
                </div>
                <p className={'w-full flex justify-end'}><span className='text-xs p-1 bg-gray-200 '>Waiting For Further Approval</span>
                </p>
            </div>
        }

        switch (approvalStatus) {
            case 'APPROVED':
                return <div className={"flex  justify-start"}>
                    <span className='bg-green-100 p-2 rounded-sm'>Approved</span>
                    {renderTreeList()}
                </div>
            case 'REJECTED':
                return <div className={"flex justify-start"}>
                    <span className='bg-red-100 p-2 rounded-sm'>Disapproved</span>
                    {renderTreeList()}
                </div>
            default:
                return <div className={"flex justify-start"}>
                    <span className='text-xs p-1 bg-gray-200'>Waiting For Approval</span> {renderTreeList()}
                </div>
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
        approve,
        isMyLevelApproved,
        approvalsAndButtonsWrapper,
    };
};