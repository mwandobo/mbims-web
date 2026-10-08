import React from "react";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import { InputLabel, styled } from "@mui/material";
import { getLabelStyle, getTextFontSize } from "@/utils/input-styler";

interface Props {
    value?: string;
    onChange: (e: any, from: string) => void;
    rows?: number;
    placeholder?: string;
    label?: string;
    from: string;
    error?: string;
    inputSize?: string;
}

const StyledTextareaAutosize = styled(TextareaAutosize)({
    width: "100%",
    border: "2px solid var(--input-border)",
    borderRadius: "5px",
    padding: "6px 10px",
    color: "var(--input-text)",
    backgroundColor: "var(--card-bg)",
    marginBottom: "10px",
    fontFamily: "inherit",
    resize: "vertical",
    "&::placeholder": {
        color: "var(--input-placeholder)",
        fontStyle: "italic",
        opacity: 0.7,
    },
    "&:focus": {
        outline: "none",
        borderColor: "var(--input-focus)",
    },
});

const TextArea = ({
                      value,
                      onChange,
                      from,
                      rows = 4,
                      label,
                      error,
                      placeholder = "Enter your text here...",
                      inputSize = "md",
                  }: Props) => {
    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        onChange(event, from);
    };

    return (
        <>
            {label && (
                <InputLabel
                    id={`${label}-select-label`}
                    style={{
                        fontSize: getLabelStyle(inputSize),
                        color: "var(--text-foreground)",
                        marginBottom: "4px",
                        fontWeight: 600,
                    }}
                >
                    {label}
                </InputLabel>
            )}

            <StyledTextareaAutosize
                value={value}
                onChange={handleChange}
                minRows={rows}
                placeholder={placeholder}
                aria-label={`${label}-select-label`}
                style={{
                    fontSize: getTextFontSize(inputSize),
                    fontWeight: 300,
                }}
            />

            {error && <p className="text-error text-sm ps-3">{error}</p>}
        </>
    );
};

export default TextArea;