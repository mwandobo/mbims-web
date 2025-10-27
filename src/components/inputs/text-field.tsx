import { TextField } from "@mui/material";
import {getInputHeight, getLabelClass, getTextFontSize} from "@/utils/input-styler";

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
    /** 🔹 Render red asterisk for required fields */
    const renderRequiredAsterisk = () => (
        <span style={{ color: "red", marginLeft: "4px" }}>*</span>
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
            {/* External label for row/column layouts */}
            {(layout === "row" || layout === "column") && label && (
                <label className={`text-black ${getLabelClass(inputSize)} flex items-center mb-2`}>
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
                        "& .MuiInputLabel-root": {
                            color: "black",
                            "&.Mui-focused": {
                                color: "black",
                            },
                        },
                        "& .MuiOutlinedInput-root": {
                            height: getInputHeight(inputSize), // 👈 dynamically controlled height
                            // "& input": {
                            //     padding: "4px 6px", // keep consistent padding
                            // },

                            "& input": {
                                padding: "8px 10px",
                                fontSize: getTextFontSize(inputSize), // 👈 dynamic font size here
                            },

                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                borderColor: "rgb(24, 118, 209)",
                            },
                        },
                        ...(isRequired && {
                            "& .MuiInputLabel-asterisk": {
                                color: "red",
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
                />
            </div>
        </div>
    );
};

export default TextFieldComponent;
