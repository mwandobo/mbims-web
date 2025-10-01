import {CheckCircle2} from "lucide-react"
import MuiDate from "../inputs/mui-date"
import MuiRadioButtonsGroup from "../inputs/mui-radio"
import MuiSelect from "../inputs/mui-select"
import TextArea from "../inputs/text-area"
import TextFieldComponent from "../inputs/text-field"
import PopupModal from "../modal/popup-modal"
import {Fragment, ReactNode} from "react"
import FileInputComponent from "@/components/inputs/file-input.component";
import MuiSelectLocal from "@/components/inputs/mui-select-local";
import {getValueFromLocalStorage} from "@/utils/local-storage.util";
import {ButtonComponent} from "@/components/button/button.component";
import MuiMultiSelectSelect from "@/components/inputs/mui-multiselect.component";

interface Props {
    isModalOpen: boolean,
    onCloseModal: () => void,
    isButtonDisabled?: boolean,
    modalTitle?: string
    isForm?: boolean
    itHasCustomForm?: boolean
    customForm?: ReactNode; // React component to be rendered
    formInputs?: any[]
    handleInputChange?: (e: any, from?: any, control_for?: string, control_type?: string) => void
    isDisabled?: boolean
    modalBodyString?: string
    size?: 'sm' | 'md' | 'lg';
    onSaveButtonName?: string
    handleSubmit: () => void,
    isShowAddPriceButton?: boolean,
}

const CrudFormComponent = ({
                               isModalOpen,
                               onCloseModal,
                               isButtonDisabled,
                               modalTitle,
                               isForm,
                               formInputs,
                               handleInputChange,
                               size,
                               isDisabled,
                               modalBodyString,
                               onSaveButtonName,
                               handleSubmit,
                               itHasCustomForm,
                               customForm,
                           }: Props) => {
    const add_price = getValueFromLocalStorage('add-price')

    const sizeGrid = () => {
        if (size === "md") {
            return 2
        }
        if (size === "lg") {
            return 3
        }
        if (size === "sm") {
            return 1
        }
        return 1
    }

    return <PopupModal
        isOpen={isModalOpen}
        onSaveButtonName={'Save'}
        onClose={onCloseModal}
        isDisabled={isButtonDisabled}
        title={modalTitle}
        size={size}
    >
        <>
            <>
                {
                    isForm
                        ?
                        <div
                            className={`w-full grid gap-2 grid-cols-1 ${size === 'md' ? 'md:grid-cols-2' : size === 'lg' ? 'md:grid-cols-3' : ''} mt-4`}>
                            {
                                itHasCustomForm && !add_price ? (
                                    customForm
                                ) : (
                                    // If itHasCustomForm is false, map over formInputs
                                    formInputs && formInputs.length > 0 && formInputs.map((item, index) => (
                                        <Fragment key={index}>{!item.isRemoved &&
                                            <div className="" key={index}>
                                                {item?.type === 'text' && (
                                                    <TextFieldComponent
                                                        placeholder={item?.placeholder}
                                                        type={item.textType}
                                                        from={item?.name}
                                                        label={item?.label}
                                                        value={item.value}
                                                        onChange={handleInputChange}
                                                        isError={item.isError}
                                                        errorMessage={item.errorMessage}
                                                        isRequired={item.required}
                                                        isDisabled={item.isDisabled}
                                                    />
                                                )}
                                                {item?.type === 'file' && (
                                                    <FileInputComponent
                                                        placeholder={item?.placeholder}
                                                        type={item.textType}
                                                        from={item?.name}
                                                        label={item?.label}
                                                        value={item.value}
                                                        onChange={handleInputChange}
                                                        isError={item.isError}
                                                        errorMessage={item.errorMessage}
                                                    />
                                                )}

                                                {item?.type === 'select' && (
                                                    <MuiSelect
                                                        handleChange={handleInputChange}
                                                        from={item?.name}
                                                        label={item?.label}
                                                        optionsUrlData={item.optionsUrlData}
                                                        optionDataKey={item.optionDataKey}
                                                        control={item.control}
                                                        control_id={item.control_id}
                                                        control_for={item.control_for}
                                                        control_type={item.control_type}
                                                        value={item.value}
                                                        error={item.errorMessage}
                                                        isDisabled={isDisabled}
                                                        isRequired={item.required}
                                                    />
                                                )}
                                                {item?.type === 'select-local' && (
                                                    <MuiSelectLocal
                                                        handleChange={handleInputChange}
                                                        from={item?.name}
                                                        label={item?.label}
                                                        optionsUrlData={item.optionsUrlData}
                                                        optionDataKey={item.optionDataKey}
                                                        control={item.control}
                                                        control_id={item.control_id}
                                                        control_for={item.control_for}
                                                        control_type={item.control_type}
                                                        value={item.value}
                                                        error={item.errorMessage}
                                                        isDisabled={isDisabled}
                                                        isRequired={item.required}
                                                    />
                                                )}

                                                {item?.type === 'multi-select' && (
                                                    <MuiMultiSelectSelect
                                                        handleChange={handleInputChange}
                                                        from={item?.name}
                                                        label={item?.label}
                                                        optionsUrlData={item.optionsUrlData}
                                                        optionDataKey={item.optionDataKey}
                                                        control={item.control}
                                                        control_id={item.control_id}
                                                        control_for={item.control_for}
                                                        control_type={item.control_type}
                                                        value={item.value}
                                                        error={item.errorMessage}
                                                        isDisabled={isDisabled}
                                                        isRequired={item.required}
                                                    />
                                                )}


                                                {item?.type === 'date' && (
                                                    <MuiDate
                                                        handleDateChange={handleInputChange}
                                                        from={item?.name}
                                                        label={item?.label}
                                                        value={item.value}
                                                        minDate={item.minDate}
                                                        maxDate={item.maxDate}
                                                        defaultValue={item.defaultDate}
                                                        isDisabled={isDisabled}
                                                    />
                                                )}

                                                {item?.type === 'textArea' && (
                                                    <TextArea
                                                        onChange={handleInputChange}
                                                        from={item?.name}
                                                        label={item?.label}
                                                        value={item.value}
                                                    />
                                                )}

                                                {item?.type === 'radio' && (
                                                    <MuiRadioButtonsGroup
                                                        onChange={handleInputChange}
                                                        from={item.name}
                                                        label={item.label}
                                                        options={item.options}
                                                        value={item.value}   // <-- Pass the current value here!
                                                    />
                                                )}
                                            </div>
                                        }
                                        </Fragment>
                                    ))
                                )
                            }
                        </div>
                        :
                        <p className={'text-gray-700'}>{modalBodyString}</p>
                }
            </>
            < div className="flex justify-end mt-4">
                <ButtonComponent
                    name={onSaveButtonName}
                    isDisabled={isDisabled}
                    onClick={handleSubmit}
                    rounded={'md'}
                    padding={'p-3'}
                    shadow={'shadow-md'}
                    bg_color={'bg-gray-50'}
                    hover={'hover:bg-gray-200 hover:border-gray-400'}
                    hover_text={'hover:text-gray-900 hover:font-semibold'}
                    border={'border border-gray-300'}
                    text_color={'text-gray-700'}
                >
                    {!isDisabled && <CheckCircle2 size={13}/>}
                </ButtonComponent>
            </div>
        </>

    </PopupModal>
}

export default CrudFormComponent