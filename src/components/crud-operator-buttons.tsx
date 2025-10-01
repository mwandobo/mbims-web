import {CheckCircle2, EyeIcon, Pen, ShieldCheck, Trash2, X} from "lucide-react";
import {ButtonComponent} from "@/components/button/button.component";
import {checkPermissions} from "@/utils/check-permissions";

interface Props {
    permission?: string;
    approval_name?: string;
    input?: any;
    handleClick?: (type: string, payload?: any) => void;
    hide_edit?: boolean;
    hide_approve?: boolean;
    hide_delete?: boolean;
    hide_view?: boolean;
    show_assign?: boolean;
    isShowAddPriceButton?: boolean;
}

const CrudButtonsComponent = ({
                                  permission,
                                  approval_name,
                                  input,
                                  handleClick,
                                  hide_approve,
                                  hide_delete,
                                  hide_view,
                                  hide_edit,
                                  show_assign,
                                  isShowAddPriceButton
                              }: Props) => {
    return <div className='p-0 m-0 inline-flex w-full gap-1'>

        {checkPermissions(`${permission ? `${permission}_read` : ""}`) &&
            <ButtonComponent
                name='View'
                onClick={() => handleClick && handleClick('show', input)}
                text_color={'text-gray-700'}
                isSmallButton={true}
                bg_color={'bg-gray-50'}
                hover={'hover:bg-gray-200 hover:border-gray-400'}
                hover_text={'hover:text-gray-900 hover:font-semibold'}
                rounded={'md'}
                border={'border border-gray-300'}
            >
                <EyeIcon size={16} color={'black'}/>
            </ButtonComponent>
        }

        {checkPermissions(`${permission ? `${permission}_delete` : ""}`) && !hide_delete &&
            <ButtonComponent
                name='Delete'
                onClick={() => handleClick && handleClick('delete', input)}
                text_color={'text-gray-700'}
                isSmallButton={true}
                bg_color={'bg-gray-50'}
                hover={'hover:bg-gray-200 hover:border-gray-400'}
                hover_text={'hover:text-gray-900 hover:font-semibold'}
                rounded={'md'}
                border={'border border-gray-300'}
            >
                <Trash2 size={16} color='red'/>
            </ButtonComponent>
        }

        {checkPermissions(`${permission ? `${permission}_update` : ""}`) && !hide_edit &&
            <ButtonComponent
                name='Edit'
                onClick={() => handleClick && handleClick('edit', input)}
                text_color={'text-gray-700'}
                isSmallButton={true}
                bg_color={'bg-gray-50'}
                hover={'hover:bg-gray-200 hover:border-gray-400'}
                hover_text={'hover:text-gray-900 hover:font-semibold'}
                rounded={'md'}
                border={'border border-gray-300'}
            >
                <Pen size={16} color={'black'}/>
            </ButtonComponent>
        }
    </div>
}

export default CrudButtonsComponent