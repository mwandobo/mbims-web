import {CheckCircle2, Filter, PlusCircle} from "lucide-react"
import React, {ReactNode, useState} from "react"
import {useGlobalContextHook} from "@/hooks/useGlobalContextHook";
import MuiBreadcrumbs from "@/components/breadcumb/mui-breadcumb";
import {ButtonComponent} from "@/components/button/button.component";
import BackButtonComponent from "@/components/button/back-button.component";
import {checkPermissions} from "@/utils/check-permissions";
import {useModal} from "@/hooks/useModal";
import PopupModal from "@/components/modal/popup-modal";
import ExcelCompare from "@/app/compare-excel/page";
import {postRequest} from "@/utils/api-calls.util";
import LoadingComponent from "@/components/status/loading.component";

interface Props {
    handleClick?: (type: string) => void
    links?: any[]
    permission?: string
    isShowPage?: boolean
    showrefresh?: boolean
    isHideAdd?: boolean
    isHideBack?: boolean
    isDownload?: boolean
    subHeader?: string
    filter?: string
    ButtonDownloadComponent?: ReactNode,
    isSmallButton?: boolean,
    pageTitle?: string
}

const CreateReconciliationComponent = ({
                        handleClick,
                        links,
                        isShowPage,
                        showrefresh,
                        filter,
                        isHideBack,
                        isDownload,
                        isHideAdd,
                        subHeader,
                        isSmallButton,
                        pageTitle,
                        permission,
                        ButtonDownloadComponent
                    }: Props) => {
    const {dispatch} = useGlobalContextHook();
    const modal = useModal(); // ← that's all you need
    const [isComparisonDone, setIsComparisonDone] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [comparisonResult, setComparisonResult] = useState<any>(null);

    const handleComparisonComplete = (result: any) => {
        setComparisonResult(result);
        setIsComparisonDone(true);
    };

    const handleCloseModal = () => {
        modal.close();
        setIsComparisonDone(false);
        setComparisonResult(null);
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        if (!comparisonResult) return;

        try {

            // Use the payload you already have from the callback
            const res = await postRequest(`reconciliations/submit`, comparisonResult);
            if (res.status !== 200) {
                throw new Error("Failed to submit");
            }

            window.location.reload(); // or your normal list refresh

            // handleCloseModal();
            // setIsLoading(false);

            // window.location.reload(); // or your normal list refresh
        } catch (err: any) {
            console.error(err);
            alert(err.message || "Submit failed");
        }
    };

    const handleFilters = () =>{
        dispatch({type: "UPDATE_APPLY_FILTERS", payload: filter})
    }

    const handleCreateClick = () => {
        if (pageTitle === 'recon') {
            modal.open();                     // ← just open the modal
        } else {
            handleClick && handleClick('create');
        }
    };

    const _showAddButton = () => {
        if( !isShowPage && !isHideAdd && checkPermissions(permission)){
            return true
        }
    }

    return (
        <div className='flex justify-between items-center p-1'>
            <>
                {subHeader ?
                    <h4 className="text-sm font-medium text-gray-700">{subHeader}</h4>
                    :
                    (subHeader === "" ? <></> : <MuiBreadcrumbs links={links} />)
                }
            </>

            <div className="flex justify-end items-center space-x-2">
                {filter && (
                    <div>
                        <ButtonComponent
                            name='Apply Filters'
                            onClick={handleFilters}
                            rounded={'md'}
                            padding={'p-1'}
                            shadow={'shadow-md'}
                            bg_color={'bg-gray-50'}
                            hover={'hover:bg-gray-200 hover:border-gray-400'}
                            hover_text={'hover:text-gray-900 hover:font-semibold'}
                            border={'border border-gray-300'}
                            text_color={'text-gray-700'}
                        >
                            <Filter size={18} />
                        </ButtonComponent>
                    </div>
                )}

                {isDownload && ButtonDownloadComponent}
                {isShowPage && !isHideBack && <BackButtonComponent />}
                {_showAddButton() && (
                    <div>
                        <ButtonComponent
                            name='Add'
                            onClick={handleCreateClick}
                            rounded={'md'}
                            padding={'p-1'}
                            shadow={'shadow-md'}
                            bg_color={'bg-gray-50'}
                            hover={'hover:bg-gray-200 hover:border-gray-400'}
                            hover_text={'hover:text-gray-900 hover:font-semibold'}
                            border={'border border-gray-300'}
                            text_color={'text-gray-700'}
                        >
                            <PlusCircle size={18} />
                        </ButtonComponent>
                    </div>
                )}
            </div>
            {pageTitle === 'recon' && (
                <PopupModal
                    isOpen={modal.isOpen}
                    onClose={handleCloseModal}
                    title="Create Reconciliation Report"
                    size="md"
                    onSaveButtonName="Save"
                >
                    {isLoading ? <LoadingComponent /> :
                        <>
                            <div className="h-[500px] overflow-y-auto overflow-x-hidden pr-2">
                                <ExcelCompare onComparisonComplete={handleComparisonComplete} />
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <ButtonComponent
                                    name="Submit"
                                    isDisabled={!isComparisonDone}          // ← disabled until comparison is done
                                    onClick={handleSubmit}
                                    rounded="md"
                                    padding="p-3"
                                    shadow="shadow-md"
                                    bg_color="bg-gray-50"
                                    hover="hover:bg-gray-200 hover:border-gray-400"
                                    hover_text="hover:text-gray-900 hover:font-semibold"
                                    border="border border-gray-300"
                                    text_color="text-gray-700"
                                />
                            </div>
                        </>
                    }
                </PopupModal>
            )}
        </div>
    );
}

export default CreateReconciliationComponent