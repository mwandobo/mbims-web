import React from "react";
import {
    FormControl,
    FormControlLabel,
    FormLabel,
    Radio,
    RadioGroup,
} from "@mui/material";

export default function MuiRadioButtonsGroup({
                                                 label,
                                                 options,
                                                 from,
                                                 onChange,
                                                 value,
                                             }) {
    const handleChange = (event) => {
        onChange(event, from);
    };

    return (
        <FormControl>
            <FormLabel
                id={`${from}-label`}
                sx={{
                    color: "var(--text-muted)",
                    "&.Mui-focused": {
                        color: "var(--input-focus)",
                    },
                }}
            >
                {label}
            </FormLabel>

            <RadioGroup
                row
                aria-labelledby={`${from}-label`}
                name={from}
                value={value ?? ""}
                onChange={handleChange}
            >
                {options.map((option) => (
                    <FormControlLabel
                        key={option.value}
                        value={option.value}
                        label={option.label}
                        disabled={option.disabled}
                        sx={{
                            color: "var(--foreground)",
                            fontWeight: 600,
                            marginBottom: "8px",
                            "&.Mui-disabled": {
                                color: "var(--text-disabled)",
                            },
                        }}
                        control={
                            <Radio
                                sx={{
                                    color: "var(--input-border)",
                                    "&.Mui-checked": {
                                        color: "var(--input-focus)",
                                    },
                                    "&.Mui-disabled": {
                                        color: "var(--text-disabled)",
                                    },
                                }}
                            />
                        }
                    />
                ))}
            </RadioGroup>
        </FormControl>
    );
}