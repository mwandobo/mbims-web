import { TextField } from "@mui/material";

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
    size?: "small" | "medium";
    onChange: (e: any, from: string) => void;
}

const TextFieldComponent = ({
                                onChange,
                                placeholder,
                                isDisabled,
                                isRequired,
                                errorMessage,
                                label,
                                value,
                                type,
                                from,
                                layout = "none",
                                size = "medium",
                            }: TextFieldComponentProps) => {
    // Render required asterisk
    const renderRequiredAsterisk = () => (
        <span style={{ color: "red", marginLeft: "4px" }}>*</span>
    );

    return (
        <div className={layout === "row" ? "flex items-center gap-4 mb-4" :
            layout === "column" ? "flex flex-col mb-4" : "mb-4"}>
            {/* External label for row/column layouts */}
            {(layout === "row" || layout === "column") && label && (
                <label className={`text-black ${size === "small" ? "text-sm" : "text-base"} flex items-center`}>
                    {label}
                    {isRequired && renderRequiredAsterisk()}
                </label>
            )}

            <div className="flex-1">
                {errorMessage && (
                    <p className="text-red-400 mb-1 text-xs">{errorMessage}</p>
                )}
                <TextField
                    label={layout === "none" ? label : undefined}
                    sx={{
                        width: "100%",
                        '& .MuiInputLabel-root': {
                            color: 'black',
                            '&.Mui-focused': {
                                color: 'black', // Keep black when focused
                            },
                        },
                        '& .MuiOutlinedInput-root': {
                            '& input': {
                                padding: size === "small" ? "6px 10px" : "16px 14px",
                            },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'rgb(24, 118, 209)', // Keep black outline when focused
                            },
                        },
                        ...(isRequired && {
                            '& .MuiInputLabel-asterisk': {
                                color: 'red',
                            },
                        }),
                    }}
                    size={size}
                    value={value}
                    placeholder={placeholder}
                    onChange={(e) => onChange(e, from)}
                    disabled={isDisabled}
                    type={type}
                    fullWidth
                    required={isRequired}
                />
            </div>
        </div>
    );
};

export default TextFieldComponent;