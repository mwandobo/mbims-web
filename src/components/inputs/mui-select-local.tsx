import React from 'react';
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';

interface Props {
    handleChange: (event: any, from: string, control_for: string, control_type?: string) => void
    rows?: number;
    placeholder?: string;
    label?: string;
    labelStyle?: string;
    from: string;
    isDisabled?: boolean;
    isSmall?: boolean;
    isRequired?: boolean;
    optionsUrlData?: any;
    optionDataKey?: string;
    value: any;
    error?: string
    control?: string
    control_id?: string
    control_for?: string
    control_type?: string
}

const MuiSelectLocal = ({
                            handleChange,
                            optionsUrlData,
                            labelStyle,
                            optionDataKey,
                            isSmall,
                            from,
                            isDisabled,
                            isRequired,
                            placeholder = 'Enter your text here...',
                            value = '-1',
                            error,
                            label = '',
                            control,
                            control_for,
                            control_type
                        }: Props) => {

    const onChange = (event: SelectChangeEvent) => {
        return handleChange(event, from, control_for, control_type);
    };

    const body = (passed_label?: string) => {
        return (
            <>
                {error && <p className="text-red-400 mb-2" style={{ fontSize: "12px" }}>{error}</p>}

                <FormControl
                    fullWidth
                    variant="outlined"
                    sx={{
                        "& .MuiOutlinedInput-root": isSmall
                            ? { height: "35px", fontSize: "12px" }
                            : {},
                        "& .MuiInputLabel-root": isSmall
                            ? { fontSize: "12px" }
                            : { fontSize: "16px" },
                        "& .MuiSvgIcon-root": isSmall
                            ? { fontSize: "18px" }
                            : {},
                        "& .MuiMenuItem-root": isSmall
                            ? { fontSize: "12px" }
                            : { fontSize: "16px" },
                    }}
                >
                    {labelStyle !== "row" && (
                        <InputLabel
                            id={`${from}-label`}
                            shrink={true}
                            sx={{
                                backgroundColor: 'white',
                                px: 1,
                                color: 'black',
                                fontSize: isSmall ? "12px" : "16px",
                                '&.Mui-focused': {
                                    color: 'black',
                                },
                            }}
                        >
                            {isRequired ? (
                                <span style={{ display: "flex", alignItems: "center" }}>
                                    {passed_label}{" "}
                                    <span style={{ color: "red", marginLeft: "4px" }}>
                                        *
                                    </span>
                                </span>
                            ) : (
                                passed_label
                            )}
                        </InputLabel>
                    )}

                    <Select
                        labelId={`${from}-label`}
                        id={`${from}-select`}
                        value={value}
                        label={labelStyle !== "row" ? passed_label : undefined}
                        onChange={onChange}
                        disabled={isDisabled}
                        required={isRequired}
                        size={isSmall ? "small" : "medium"}
                        sx={{
                            marginBottom: "20px",
                            height: isSmall ? "35px" : "auto",
                            fontSize: isSmall ? "12px" : "16px",
                            '& .MuiSelect-select': {
                                paddingTop: isSmall ? '8px' : '14px',
                                paddingBottom: isSmall ? '8px' : '14px',
                            }
                        }}
                        displayEmpty
                    >
                        {optionsUrlData &&
                            optionsUrlData.length > 0 &&
                            optionsUrlData.map((option: any) => (
                                <MenuItem
                                    key={option.value}
                                    value={option.value}
                                    sx={{ fontSize: isSmall ? "12px" : "16px" }}
                                >
                                    {option.label}
                                </MenuItem>
                            ))}
                    </Select>
                </FormControl>
            </>
        );
    };

    return (
        <div className="w-full">
            {labelStyle === "row" ? (
                <div className="flex w-full justify-center items-center gap-2">
                    <p className="min-w-[100px] max-w-[150px] text-right text-xs font-medium text-gray-700 truncate flex flex-col justify-center">
                        {label}
                    </p>
                    <div className="flex-1">
                        {body()}
                    </div>
                </div>
            ) : (
                <div>
                    {body(label)}
                </div>
            )}
        </div>
    );
};

export default MuiSelectLocal;