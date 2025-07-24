"use client"

import {useRouter} from "next/navigation"
import {ReactNode, useEffect, useState} from "react"
import {setValueLocalStorage} from "@/utils/local-storage.util";
import {useGlobalContextHook} from "@/hooks/useGlobalContextHook";
import {useCrudFormCreatorHook} from "@/hooks/page-render-hooks/use-form-creator.hook";

interface Props {
    formInputData: any[],
    incomingUrl: string,
    incomingModalTitle: string,
    viewUrl: string
    state_properties: any[]
    callBackFunction?: (selectedCard: string, id?: string) => void
    emailNotificationBody?: any
    from?: string
    isApiV2?: boolean
    sliderComponent?: any
    isMaintainViewNavigationForV1?: boolean
    itHasCustomForm?: boolean
    customForm?: ReactNode;
    isShowAddPriceButton?: boolean,
    isFormData?: boolean
}

export const useCrudOperatorHook = (
    {
        formInputData,
        incomingUrl,
        incomingModalTitle,
        viewUrl,
        state_properties,
        callBackFunction,
        isFormData,
        from,
        itHasCustomForm,
        sliderComponent,
        customForm,
        isShowAddPriceButton,
        emailNotificationBody: incomingEmailNotificationBody,
        isApiV2,
        isMaintainViewNavigationForV1
    }: Props
) => {
    const router = useRouter()
    const [selected, setSelected] = useState<any>()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [httpMethod, setHttpMethod] = useState('')
    const [onSaveButtonName, setOnSaveButtonName] = useState('save')
    const [url, setUrl] = useState(incomingUrl)
    const [modalTitle, setModalTitle] = useState(incomingModalTitle)
    const [modalBodyArray, setModalBodyArray] = useState<any[]>(formInputData)
    const [modalBodyString, setModalBodyString] = useState('')
    const [emailNotificationBody, setEmailNotificationBody] = useState(incomingEmailNotificationBody)
    const [isButtonDisabled, setIsButtonDisabled] = useState(false)
    const [isForm, setIsForm] = useState(true)
    const {state, dispatch} = useGlobalContextHook()
    const onCloseModal = () => setIsModalOpen(false)
    const [isSideOverOpened, setIsSideOverOpen] = useState(false)


    const formPayload: any = {
        isModalOpen: isModalOpen,
        onCloseModal: onCloseModal,
        from,
        url,
        httpMethod,
        modalTitle,
        modalBodyArray,
        modalBodyString,
        isButtonDisabled,
        isForm,
        onSaveButtonName,
        payloadForEdit: selected,
        state_properties: state_properties,
        emailNotificationBody: emailNotificationBody,
        itHasCustomForm: itHasCustomForm,
        customForm: customForm,
        isShowAddPriceButton,
        isFormData
    }

    const {
        createdForm,
        isStateChanged,
    } = useCrudFormCreatorHook(formPayload)

    // TO DO bypass the
    const parseDate = (value: any) => {
        const dateArray = value.split('-')
        const newDate = `${dateArray[1]}-${dateArray[0]}-${dateArray[2]}`

        return value
    }

    const populateFormForEdit = (payload: any) => {
        console.log('payload to edit', payload );

        const newModalBodyArray = modalBodyArray.map((item: any) => {
            let objKeyValue: any;
            if(item.name === 'canReceiveEmail'){
                objKeyValue = payload[item.name] === true ? 1: 0;
            }

           else if (item.name === 'dateOfBirth') {
                objKeyValue = parseDate(payload[item.name]);
            } else {
                objKeyValue = payload[item.name];
            }

            if (item.type === 'file') {
                item.required = false;
            }

            if (item.controlled_by && payload[item.name] != null) {
                item.isRemoved = false;
            }

            return {...item, value: objKeyValue};
        });

        setModalBodyArray(newModalBodyArray);
    };


    const clearFormForCreate = () => {
        const newModalBodyArray = modalBodyArray.map((item: any) => {

            if (from === 'quotation' &&
                (
                    item.name === 'request_for_quotation_id' ||
                    item.name === 'supplier_id'
                )) {
                return {...item, isRemoved: false};
            }

            if (from === 'sale-quotation' &&
                (
                    item.name === 'sale_rfq_id' ||
                    item.name === 'item_ids'
                )) {
                return {...item, isRemoved: false};
            }

            if (from === 'invoices' &&
                (
                    item.name === 'type' ||
                    item.name === 'purchase_order_id'
                )) {
                return {...item, isRemoved: false,};
            }

            return {...item, value: ''};
        });

        setModalBodyArray(newModalBodyArray);
    };


    useEffect(() => {
        setModalBodyArray(formInputData)
    }, [...state_properties])

    const handleNotificationPayload = (type: string) => {
        if (emailNotificationBody && Object.keys(emailNotificationBody).length > 0) {
            const newEmailNotificationBody = {...emailNotificationBody, operation: type}
            setEmailNotificationBody(newEmailNotificationBody)
        }
    }

    const handleCloseSlideOver = () => {
        setIsSideOverOpen(!isSideOverOpened)
    }

    const handleClick = (type: string, payload?: any) => {
        const insertIdBeforeQueryParams = (url: string, id: string | number) => {
            const [baseUrl, queryParams] = url.split('?');
            return queryParams ? `${baseUrl}/${id}?${queryParams}` : `${baseUrl}/${id}`;
        };

        if (type.toLowerCase() === 'create') {
            setIsModalOpen(true);
            setModalTitle(`Create ${incomingModalTitle}`);
            setIsForm(true);
            setOnSaveButtonName('Save');
            setUrl(!isApiV2 ? `${incomingUrl}/store` : incomingUrl);
            setHttpMethod('post');
            clearFormForCreate()
            handleNotificationPayload('create');
        }

        if (type.toLowerCase() === 'edit') {
            populateFormForEdit(payload);
            setIsModalOpen(true);
            setModalTitle(`Edit ${incomingModalTitle}`);
            setIsForm(true);
            setOnSaveButtonName('Update');
            setSelected(payload);
            const newUrl = !isApiV2
                ? insertIdBeforeQueryParams(`${incomingUrl}/update`, payload?.id)
                : insertIdBeforeQueryParams(incomingUrl, payload?.id);
            setUrl(newUrl);
            setHttpMethod('put');
            handleNotificationPayload('edit');
        }

        if (type.toLowerCase() === 'delete') {
            setIsModalOpen(true);
            const newUrl = !isApiV2
                ? insertIdBeforeQueryParams(`${incomingUrl}/delete`, payload?.id)
                : insertIdBeforeQueryParams(incomingUrl, payload?.id);
            setUrl(newUrl);
            setHttpMethod('delete');
            setModalTitle(`Delete ${incomingModalTitle}`);
            setIsForm(false);
            setOnSaveButtonName('Yes');
            setModalBodyString(`Are You Sure You Want to Delete this ${incomingModalTitle} ${payload.name ?? payload.formatted_code}`);
            handleNotificationPayload('delete');
        }

        if (type.toLowerCase() === 'show') {
            handleNotificationPayload('show');
            if (sliderComponent) {
                dispatch({
                    type: 'UPDATE_SLIDE_OVER_CONTENT',
                    payload: {
                        isOpen: true,
                        from_id: payload?.id,
                        payload: payload,
                        sliderOverComponent: sliderComponent,
                    }
                })
                return
            }

            if (isApiV2 && !isMaintainViewNavigationForV1) {
                dispatch({type: 'SET_SUB_VIEW_ITEM', payload: {id: payload?.id, from}});
                setValueLocalStorage('sub_view_item', JSON.stringify({id: payload?.id, from}));
                return;
            }

            if (callBackFunction) {
                const selectedViewCard = state?.planningItem?.from

                if (selectedViewCard === 'goal') {
                    callBackFunction('goal/show', payload?.id);
                } else if (['outcome', 'goal/show'].includes(selectedViewCard)) {
                    callBackFunction('outcome/show', payload?.id);
                    // } else if (selectedViewCard === 'output') {
                } else if (['output', 'outcome/show'].includes(selectedViewCard)) {
                    callBackFunction('output/show', payload?.id);
                } else if (['activity', 'output/show'].includes(selectedViewCard)) {
                    callBackFunction('activity/show', payload?.id);
                }
            } else {
                const newUrl = insertIdBeforeQueryParams(`${viewUrl}`, payload?.id);
                router.push(newUrl);
                if (payload.has_parent) {
                    setValueLocalStorage('parent_id', payload.parent_id);
                }
            }
        }

        if (type.toLowerCase() === 'assign') {
            router.push(`roles/assign/${payload?.id}`);
        }
    };

    return {
        handleClick,
        createdForm,
        isStateChanged,
    }
}