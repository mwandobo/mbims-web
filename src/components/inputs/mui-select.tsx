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
import {
    getInputHeight,
    getLabelClass,
    getTextFontSize,
} from "@/utils/input-styler";

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
    layout?: string;
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
        } else if (optionsUrlData) {
            fetchData();
        }
    }, [optionsUrlData, control, optionDataKey]);

    const normalizedValue = String(value || "");

    const renderRequiredAsterisk = () => (
        <span className="text-error ml-1">*</span>
    );

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
            {(layout === "row" || layout === "column") && label && (
                <label
                    className={`text-foreground ${getLabelClass(inputSize)} flex items-center mb-2`}
                >
                    {label}
                    {isRequired && renderRequiredAsterisk()}
                </label>
            )}

            <div className="flex-1">
                {error && <p className="text-error mb-1 text-xs">{error}</p>}

                <FormControl fullWidth>
                    <InputLabel
                        id={`${label}-select-label`}
                        sx={{
                            color: "var(--text-muted)",
                            "&.Mui-focused": { color: "var(--input-focus)" },
                            display: layout === "none" ? "block" : "none",
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
                            color:
                                normalizedValue === ""
                                    ? "var(--input-placeholder)"
                                    : "var(--input-text)",
                            backgroundColor: "var(--card-bg)",
                            "& .MuiSelect-icon": {
                                color: "var(--text-muted)",
                            },
                            "& .MuiOutlinedInput-notchedOutline": {
                                borderColor: "var(--input-border)",
                            },
                            "&:hover .MuiOutlinedInput-notchedOutline": {
                                borderColor: "var(--input-focus)",
                            },
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                borderColor: "var(--input-focus)",
                            },
                            "&.Mui-disabled": {
                                backgroundColor: "var(--muted-bg)",
                                color: "var(--text-disabled)",
                            },
                            // dropdown paper
                            "& .MuiPaper-root": {
                                backgroundColor: "var(--card-bg)",
                                color: "var(--foreground)",
                            },
                        }}
                        MenuProps={{
                            PaperProps: {
                                sx: {
                                    backgroundColor: "var(--card-bg)",
                                    color: "var(--foreground)",
                                    border: "1px solid var(--card-border)",
                                },
                            },
                        }}
                    >
                        <MenuItem
                            value=""
                            disabled
                            sx={{
                                fontSize: getTextFontSize(inputSize),
                                color: "var(--input-placeholder)",
                            }}
                        >
                            <em>{placeholder}</em>
                        </MenuItem>

                        {options.map((option: any) => (
                            <MenuItem
                                key={option.value}
                                value={option.value}
                                sx={{
                                    fontSize: getTextFontSize(inputSize),
                                    color: "var(--foreground)",
                                    "&:hover": {
                                        backgroundColor: "var(--muted-bg)",
                                    },
                                    "&.Mui-selected": {
                                        backgroundColor: "var(--muted-bg)",
                                        "&:hover": {
                                            backgroundColor: "var(--table-row-hover)",
                                        },
                                    },
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