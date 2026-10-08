import React from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { TextField } from "@mui/material";

interface Props {
    handleDateChange: (date: any, from: string) => void;
    from: string;
    label?: string;
    value?: string;
    isDisabled?: boolean;
    inputSize?: string;
    layout?: string;
    isRequired?: boolean;
    minDate?: string;
    maxDate?: string;
    defaultValue?: string;
    error?: string;
}

export default function MuiDate({
                                    handleDateChange,
                                    from,
                                    label,
                                    value,
                                    isDisabled,
                                    inputSize = "md",
                                    layout = "none",
                                    isRequired,
                                    minDate,
                                    maxDate,
                                    defaultValue,
                                    error,
                                }: Props) {
    const parseDate = (value?: string) => (value ? dayjs(value) : null);

    const onChange = (date: any) => {
        if (date && date.isValid()) {
            const formattedDate = date.format("YYYY-MM-DD");
            const event = { target: { value: formattedDate } };
            handleDateChange(event, from);
        }
    };

    const getInputHeight = () => {
        switch (inputSize) {
            case "xs":
                return 32;
            case "sm":
                return 40;
            case "lg":
                return 56;
            default:
                return 48;
        }
    };

    const getFontSize = () => {
        switch (inputSize) {
            case "xs":
                return "12px";
            case "sm":
                return "13px";
            case "lg":
                return "16px";
            default:
                return "14px";
        }
    };

    const getLabelFontSize = () => {
        switch (inputSize) {
            case "xs":
                return "12px";
            case "sm":
                return "13px";
            case "lg":
                return "16px";
            default:
                return "14px";
        }
    };

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

    const renderRequiredAsterisk = () =>
        isRequired ? <span className="text-error ml-1">*</span> : null;

    const renderDatePicker = (passedLabel?: string) => (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
                label={passedLabel}
                format="DD-MM-YYYY"
                disabled={isDisabled}
                value={parseDate(value)}
                onChange={onChange}
                minDate={parseDate(minDate)}
                maxDate={parseDate(maxDate)}
                defaultValue={parseDate(defaultValue)}
                enableAccessibleFieldDOMStructure={false}
                slots={{
                    textField: (params) => {
                        const { areAllSectionsEmpty, sectionListRef, ...safeParams } =
                            params as any;

                        return (
                            <TextField
                                {...safeParams}
                                fullWidth
                                disabled={isDisabled}
                                InputProps={{
                                    ...safeParams.InputProps,
                                    sx: {
                                        "& .MuiInputBase-input": {
                                            fontSize: getFontSize(),
                                            height: getInputHeight() - 16,
                                            padding: "8px 10px",
                                            color: "var(--input-text)",
                                        },
                                    },
                                }}
                                InputLabelProps={{
                                    ...safeParams.InputLabelProps,
                                    sx: {
                                        fontSize: getLabelFontSize(),
                                        color: "var(--text-muted)",
                                        "&.Mui-focused": {
                                            color: "var(--input-focus)",
                                        },
                                    },
                                }}
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        height: getInputHeight(),
                                        backgroundColor: "var(--card-bg)",
                                        "& fieldset": {
                                            borderColor: "var(--input-border)",
                                        },
                                        "&:hover fieldset": {
                                            borderColor: "var(--input-focus)",
                                        },
                                        "&.Mui-focused fieldset": {
                                            borderColor: "var(--input-focus)",
                                        },
                                        "&.Mui-disabled": {
                                            backgroundColor: "var(--muted-bg)",
                                            "& .MuiInputBase-input": {
                                                color: "var(--text-disabled)",
                                                WebkitTextFillColor: "var(--text-disabled)",
                                            },
                                        },
                                    },
                                    "& .MuiSvgIcon-root": {
                                        color: "var(--text-muted)",
                                        fontSize:
                                            inputSize === "xs"
                                                ? 18
                                                : inputSize === "sm"
                                                    ? 20
                                                    : 24,
                                    },
                                }}
                            />
                        );
                    },
                }}
            />
        </LocalizationProvider>
    );

    return (
        <div className="w-full">
            {layout === "row" ? (
                <div className="flex w-full gap-2 items-center mb-3">
                    {label && (
                        <label
                            className={`text-foreground text-sm md:min-w-[100px] min-w-[60px] max-w-[150px] text-right flex ${getLabelClass()} items-center`}
                        >
                            {label}
                            {renderRequiredAsterisk()}
                        </label>
                    )}
                    <div className="flex-1">{renderDatePicker()}</div>
                </div>
            ) : layout === "column" ? (
                <div className="flex flex-col mb-3">
                    {label && (
                        <label
                            className={`text-foreground mb-1 flex ${getLabelClass()} items-center`}
                        >
                            {label}
                            {renderRequiredAsterisk()}
                        </label>
                    )}
                    {renderDatePicker()}
                </div>
            ) : (
                renderDatePicker(label)
            )}

            {error && (
                <p className="text-error mt-1 text-xs ps-1">{error}</p>
            )}
        </div>
    );
}