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
                       inputSize = "md",
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

    /** 🔹 Get label text size */
    const getLabelClass = () => {
        switch (inputSize) {
            case "xs":
                return "text-lg";
            case "sm":
                return "text-xl";
            case "md":
                return "text-2xl";
            case "lg":
                return "text-4xl";
            default:
                return "text-xl";
        }
    };

    /** 🔹 Get select height */
    const getSelectHeight = () => {
        switch (inputSize) {
            case "xs":
                return 32;
            case "sm":
                return 40;
            case "md":
                return 56;
            case "lg":
                return 64;
            default:
                return 48;
        }
    };

    /** 🔹 Get text font size */
    const getTextFontSize = () => {
        switch (inputSize) {
            case "xs":
                return "1rem";
            case "sm":
                return "1.3rem";
            case "md":
                return "1.6rem";
            case "lg":
                return "2rem";
            default:
                return "1.4rem";
        }
    };

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
                <label className={`text-black ${getLabelClass()} flex items-center mb-2`}>
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
                            fontSize: getTextFontSize(),
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
                            height: getSelectHeight(),
                            fontSize: getTextFontSize(),
                            color: "black",
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                borderColor: "rgb(24, 118, 209)", // consistent blue
                            },
                        }}
                    >
                        <MenuItem value="" disabled>
                            <em>{placeholder}</em>
                        </MenuItem>

                        {options &&
                            options.length > 0 &&
                            options.map((option: any) => (
                                <MenuItem
                                    key={option.value}
                                    value={option.value}
                                    sx={{
                                        fontSize: getTextFontSize(),
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
