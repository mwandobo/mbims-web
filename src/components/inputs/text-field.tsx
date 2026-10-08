import { TextField } from "@mui/material";
import { getInputHeight, getLabelClass, getTextFontSize } from "@/utils/input-styler";

interface TextFieldComponentProps {
    placeholder?: string;
    isDisabled?: boolean;
    isRequired?: boolean;
    isError?: boolean;
    label?: string;
    value?: string;
    type?: string;
    from: string;
    errorMessage?: string;
    layout?: "row" | "column" | "none";
    inputSize?: string;
    onChange: (e: any, from: string) => void;
}

const TextFieldComponent = ({
                                onChange,
                                placeholder = "Enter your text here",
                                isDisabled,
                                isRequired,
                                errorMessage,
                                label,
                                value,
                                type,
                                from,
                                layout = "none",
                                inputSize = "md",
                            }: TextFieldComponentProps) => {
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
                {errorMessage && (
                    <p className="text-error mb-1 text-xs">{errorMessage}</p>
                )}

                <TextField
                    label={layout === "none" ? label : undefined}
                    sx={{
                        width: "100%",
                        "& .MuiInputLabel-root": {
                            color: "var(--text-muted)",
                            "&.Mui-focused": {
                                color: "var(--input-focus)",
                            },
                        },
                        "& .MuiOutlinedInput-root": {
                            height: getInputHeight(inputSize),
                            color: "var(--input-text)",
                            backgroundColor: "var(--card-bg)",

                            "& input": {
                                padding: "8px 10px",
                                fontSize: getTextFontSize(inputSize),
                                color: "var(--input-text)",
                                "&::placeholder": {
                                    color: "var(--input-placeholder)",
                                    opacity: 1,
                                },
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
                                "& input": {
                                    color: "var(--text-disabled)",
                                    WebkitTextFillColor: "var(--text-disabled)",
                                },
                            },
                        },
                        ...(isRequired && {
                            "& .MuiInputLabel-asterisk": {
                                color: "var(--error)",
                            },
                        }),
                    }}
                    value={value}
                    placeholder={placeholder}
                    onChange={(e) => onChange(e, from)}
                    disabled={isDisabled}
                    type={type}
                    fullWidth
                    required={isRequired}
                    error={Boolean(errorMessage)}
                />
            </div>
        </div>
    );
};

export default TextFieldComponent;