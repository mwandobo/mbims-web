import {ReactNode, useEffect, useState} from "react"
import Swal from "sweetalert2"
import ToastComponent from "@/components/popup/toast";
import CrudFormComponent from "@/components/forms/crud-form.component";
import {baseURL, deleteRequest, postRequest, putRequest} from "@/utils/api-calls.util";
import {getValueFromLocalStorage} from "@/utils/local-storage.util";

interface Props {
    isModalOpen: boolean
    onCloseModal: () => void
    onSaveButtonName?: string
    isShowAddPriceButton?: boolean,
    modalTitle: string
    url: string
    httpMethod: string
    from: string
    modalBodyArray?: any[]
    modalBodyString?: string
    isButtonDisabled?: boolean
    itHasCustomForm?: boolean
    customForm?: ReactNode;
    isForm?: boolean
    state_properties: any[]
    isMultipart?: boolean,
    isFormData?: boolean
}

export const useCrudFormCreatorHook = ({
                                           isModalOpen,
                                           onCloseModal,
                                           onSaveButtonName = 'save',
                                           modalTitle,
                                           url,
                                           httpMethod,
                                           modalBodyArray,
                                           modalBodyString,
                                           itHasCustomForm,
                                           customForm,
                                           isButtonDisabled,
                                           isForm,
                                           state_properties = [],
                                           isShowAddPriceButton,
                                           from,
                                           isFormData
                                       }: Props) => {
    const createPayload = (body: any[]) => {
        const payload: any = {};
        body?.forEach((input) => {
            if (!input.isRemoved) {
                payload[input?.name] = input?.value;
            }
        });

        return payload
    };

    const createFormInputs = (clear?: string) => {
        let payload: any[] = [];
        modalBodyArray?.forEach((input) => {
            payload = [...payload, input];
        });

        return payload
    };

    const [isDisabled, setIsDisabled] = useState(false)
    const [isStateChanged, setIsStateChanged] = useState(false)
    const [formData, setFormData] = useState<any>(createPayload(modalBodyArray))
    const [formInputs, setFormInputs] = useState<any[]>(createFormInputs())

    const handleInputChange = (e: any, from?: any, control_for?: string, control_type?: string) => {
        try {
            formData[from] = from === 'file' ? e.target.files[0] : e.target.value
            const body = {
                from,
                value: e.target.value,
                control_for,
                control_type
            }
            updateFormDataPayload(body)
            setFormData(formData)
        } catch (error: any) {
            console.log(error)
        }
    };

    const handleControlVisibility = (controlFor: string, value?: string) =>
        formInputs?.map(input => ({
            ...input,
            isRemoved: input.controlled_by === controlFor
                ? value !== input.control
                : input.isRemoved
        }));

    const sideUpdateUrlPayload = (control_for: string, value?: string) => {
        return formInputs?.map((input) => {

            if (input.control === control_for) {
                let selectUrl;
                try {
                    selectUrl = new URL(input.optionsUrlData);
                } catch (error) {
                    selectUrl = new URL(`api/${input.optionsUrlData}`, baseURL);
                }

                selectUrl.searchParams.set('type', value);
                input.optionsUrlData = selectUrl.toString();

                return input
            }

            return input;
        });
    };

    interface UpdateFormDataProps {
        from?: string
        value?: string
        clear?: string
        control_for?: string
        control_type?: string
    }

    const updateFormDataPayload = (body: UpdateFormDataProps) => {
        const {
            from,
            value,
            clear,
            control_for,
            control_type
        } = body
        let newfoundInputs = [...formInputs];

        // Copy the formInputs array
        if (clear) {
            newfoundInputs = newfoundInputs.map(input => ({...input, value: '', errorMessage: ''}));
        }

        if (control_for) {
            switch (control_type) {
                case 'hide-show':
                    newfoundInputs = handleControlVisibility(control_for, value); // Update inputs for sponsors
                    break;
                case 'update-url':
                    newfoundInputs = sideUpdateUrlPayload(control_for, value); // Update inputs for sponsors
                    break;
                default:
                    break;
            }
        }

        if (from) {
            newfoundInputs = newfoundInputs.map(input => {
                if (input.name === from) {
                    return {...input, value: value, errorMessage: ""};
                }
                return input;
            });
        }

        setFormInputs(newfoundInputs); // Update the form inputs state
    };

    const validator = () => {
        let validation = true;

        // Collect errors for all inputs
        const updatedInputs = formInputs.map(item => {
            if (item.required && !item.isRemoved && !formData[item.name]) {
                validation = false;
                return {
                    ...item,
                    errorMessage: `${item.name} is Required`, // Add error message
                };
            }

            return {
                ...item,
                errorMessage: '', // Clear error if no validation issue
            };
        });

        // Update the state with the new input errors
        setFormInputs(updatedInputs);
        return validation;
    };

    const handleSubmit = async () => {
        try {
            const add_price = getValueFromLocalStorage('add-price')
            setIsDisabled(true)
            let response;
            const token = getValueFromLocalStorage('token')
            if (httpMethod === 'delete') {
                response = await deleteRequest<any>(url)
            } else {
                if (validator()) {
                    let _formData = itHasCustomForm && !add_price ? getValueFromLocalStorage('customFormData') : formData
                    if (httpMethod === 'post') {
                        response = await postRequest<any>(url, _formData, isFormData)
                    }
                    if (httpMethod === 'put') {
                        response = await putRequest<any>(url, _formData)
                    }
                }
            }
            if ([200, 201].includes(response?.status)) {
                ToastComponent({text: response?.data?.message ?? "Operation Went Successfully", duration: 1000})
                setIsStateChanged(!isStateChanged)
                closeModel()
            }
            setIsDisabled(false)

        } catch (error) {
            setIsDisabled(false)
            const text = error?.response?.data?.message?? error?.response?.data?.error
            Swal.fire({
                title: 'Error Occured!',
                text,
                icon: 'error',
            });

            console.error('CrudFormItemError:', error);
        }
    }

    const closeModel = () => {
        onCloseModal()
        updateFormDataPayload({clear: 'clear'})
    }

    useEffect(() => {
        setFormInputs(createFormInputs())
        setFormData(createPayload(modalBodyArray));

    }, [modalBodyArray, ...state_properties])

    const createdForm = (size?: any) => {

        return < CrudFormComponent
            isModalOpen={isModalOpen}
            onCloseModal={onCloseModal}
            handleSubmit={handleSubmit}
            isButtonDisabled={isButtonDisabled}
            modalTitle={modalTitle}
            isForm={isForm}
            formInputs={formInputs}
            handleInputChange={handleInputChange}
            size={size}
            isDisabled={isDisabled}
            modalBodyString={modalBodyString}
            onSaveButtonName={onSaveButtonName}
            itHasCustomForm={itHasCustomForm}
            customForm={customForm}
            isShowAddPriceButton={isShowAddPriceButton}
        />
    }
    return {
        createdForm,
        isStateChanged
    }
}