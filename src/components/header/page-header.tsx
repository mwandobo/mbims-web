import {Filter, PlusCircle} from "lucide-react"
import React, {ReactNode} from "react"
import {useGlobalContextHook} from "@/hooks/useGlobalContextHook";
import MuiBreadcrumbs from "@/components/breadcumb/mui-breadcumb";
import {ButtonComponent} from "@/components/button/button.component";
import BackButtonComponent from "@/components/button/back-button.component";
import {checkPermissions} from "@/utils/check-permissions";

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
    isSmallButton?: boolean
}

const PageHeader = ({
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
                        permission,
                        ButtonDownloadComponent
                    }: Props) => {
    const {dispatch} = useGlobalContextHook();

    const handleFilters = () =>{
        dispatch({type: "UPDATE_APPLY_FILTERS", payload: filter})
    }

    const _showAddButton = () => {

        console.log('(permission)', checkPermissions(permission))
        if( !isShowPage && !isHideAdd && checkPermissions(permission)){
            return true
        }
    }

    return (<div className='flex justify-between items-center p-1 '>
            <>
                {subHeader ?
                    <h4 className="text-sm font-medium text-gray-700">{subHeader}</h4>
                    :
                    (subHeader === "" ? <></> : <MuiBreadcrumbs links={links}/>)
                }
            </>

            <div className="flex justify-end items-center space-x-2">

                {filter &&

                    < div className=''>
                        <ButtonComponent
                            name='Apply Filters'
                            onClick={() => handleFilters()}
                            rounded={'md'}
                            padding={'p-1'}
                            shadow={'shadow-md'}
                            bg_color={'bg-gray-50'}
                            hover={'hover:bg-gray-200 hover:border-gray-400'}
                            hover_text={'hover:text-gray-900 hover:font-semibold'}
                            border={'border border-gray-300'}
                            text_color={'text-gray-700'}
                        >
                            <Filter size={18}/>
                        </ButtonComponent>
                    </div>
                }
                {
                    isDownload && ButtonDownloadComponent
                }
                {isShowPage && !isHideBack &&
                    <BackButtonComponent/>
                }

                {_showAddButton() &&
                    < div className=''>
                        <ButtonComponent
                            name='Add'
                            onClick={() => handleClick && handleClick('create')}
                            rounded={'md'}
                            padding={'p-1'}
                            shadow={'shadow-md'}
                            bg_color={'bg-gray-50'}
                            hover={'hover:bg-gray-200 hover:border-gray-400'}
                            hover_text={'hover:text-gray-900 hover:font-semibold'}
                            border={'border border-gray-300'}
                            text_color={'text-gray-700'}
                        >
                            <PlusCircle size={18}/>
                        </ButtonComponent>
                    </div>
                }
            </div>
        </div>
    )
}

export default PageHeader