import React, { useEffect, useState } from "react";
import {
    Select,
    FormControl,
    InputLabel,
    MenuItem,
    SelectChangeEvent,
} from "@mui/material";
import { getRequest } from "@/utils/api-calls.util";
import CreateOptionsForSelect from "@/utils/create-options-for-select";
import {getInputHeight, getLabelClass, getTextFontSize} from "@/utils/input-styler";

interface Props {
    handleChange: (
        event: any,
        from: string,
        control_for: string,
        control_type: string
    ) => void;
    placeholder?: string;
    label?: string;
    from: string;
    isDisabled?: boolean;
    isRequired?: boolean;
    optionsUrlData?: string;
    optionDataKey?: string;
    value: any;
    error?: string;
    control?: string;
    control_id?: string;
    control_for?: string;
    control_type?: string;
    inputSize?: string;
    layout?: string; // 👈 Added
}

const MuiSelect = ({
                       handleChange,
                       optionsUrlData,
                       optionDataKey,
                       from,
                       isDisabled,
                       isRequired,
                       placeholder = "Select option...",
                       value,
                       error,
                       label = "",
                       control,
                       control_for,
                       control_type,
                       inputSize = "none",
                       layout = "none",
                   }: Props) => {
    const [options, setOptions] = useState<any[]>([]);

    const onChange = (event: SelectChangeEvent) => {
        return handleChange(event, from, control_for, control_type);
    };

    const assumptionOptions = [
        { label: "Assumption", value: "assumption" },
        { label: "Constraint", value: "constraint" },
    ];

    useEffect(() => {
        const fetchData = async () => {
            const res = await getRequest(optionsUrlData);

            if (res && res.status === 200) {
                const payload = CreateOptionsForSelect(res.data as any, optionDataKey);
                setOptions(payload);
            }
        };

        if (control === "assumption") {
            setOptions(assumptionOptions);
        } else {
            fetchData();
        }
    }, [optionsUrlData]);

    const normalizedValue = String(value || "");

    /** 🔹 Render red asterisk for required fields */
    const renderRequiredAsterisk = () => (
        <span style={{ color: "red", marginLeft: "4px" }}>*</span>
    );


    /** 🔹 Get select height */
    return (
        <div
            className={
                layout === "row"
                    ? "flex items-center gap-4 mb-4"
                    : layout === "column"
                        ? "flex flex-col mb-4"
                        : "mb-4"
            }
        >
            {/* External label for row/column layouts */}
            {(layout === "row" || layout === "column") && label && (
                <label className={`text-black ${getLabelClass(inputSize)} flex items-center mb-2`}>
                    {label}
                    {isRequired && renderRequiredAsterisk()}
                </label>
            )}

            <div className="flex-1">
                {error && (
                    <p className="text-red-400 mb-1 text-xs">{error}</p>
                )}

                <FormControl fullWidth>
                    <InputLabel
                        id={`${label}-select-label`}
                        sx={{
                            color: "black",
                            "&.Mui-focused": { color: "black" },
                            display: layout === "none" ? "block" : "none", // Hide internal label if external layout
                            fontSize: getTextFontSize(inputSize),
                        }}
                    >
                        {label}
                        {isRequired && renderRequiredAsterisk()}
                    </InputLabel>

                    <Select
                        labelId={`${label}-select-label`}
                        id={`${label}-select`}
                        value={normalizedValue}
                        label={layout === "none" ? label : undefined}
                        onChange={onChange}
                        disabled={isDisabled}
                        required={isRequired}
                        displayEmpty
                        sx={{
                            height: getInputHeight(inputSize),
                            fontSize: getTextFontSize(inputSize),
                            color: normalizedValue === "" ? "#747B86" : "black", // 👈 changes text color when selected
                            "& .MuiSelect-icon": {
                                color: "#747B86", // optional: make dropdown arrow consistent
                            },
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                borderColor: "rgb(24, 118, 209)",
                            },
                        }}
                    >
                        <MenuItem
                            value=""
                            sx={{
                                fontSize: getTextFontSize(inputSize),
                                color: "#747B86", // 👈 placeholder color
                            }}
                            disabled
                        >
                            <em>{placeholder}</em>
                        </MenuItem>

                        {options &&
                            options.length > 0 &&
                            options.map((option: any) => (
                                <MenuItem
                                    key={option.value}
                                    value={option.value}
                                    sx={{
                                        fontSize: getTextFontSize(inputSize),
                                        color: "black", // 👈 ensure normal text is black
                                    }}
                                >
                                    {option.label}
                                </MenuItem>
                            ))}
                    </Select>

                </FormControl>
            </div>
        </div>
    );
};

export default MuiSelect;
