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
    size?: "xs" | "sm" | "md" | "lg";
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
                                size = "md",
                            }: TextFieldComponentProps) => {
    /** 🔹 Render red asterisk for required fields */
    const renderRequiredAsterisk = () => (
        <span style={{ color: "red", marginLeft: "4px" }}>*</span>
    );

    /** 🔹 Get label text size based on `size` prop */
    const getLabelClass = () => {
        switch (size) {
            case "xs":
                return "text-lg";
            case "sm":
                return "text-xl";
            case "md":
                return "text-2xl";
            case "lg":
                return "text-4xl";
            default:
                return "text-base";
        }
    };

    /** 🔹 Get input height (visual size) based on `size` prop */
    const getInputHeight = () => {
        switch (size) {
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

    const getInputFontSize = () => {
        switch (size) {
            case "xs":
                return "1rem"; // 12px
            case "sm":
                return "1.3rem"; // 14px
            case "md":
                return "1.6rem";
            case "lg":
                return "2rem"; // 16px// 16px
            default:
                return "1rem"; // ~15px
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
                            height: getInputHeight(), // 👈 dynamically controlled height
                            // "& input": {
                            //     padding: "4px 6px", // keep consistent padding
                            // },

                            "& input": {
                                padding: "8px 10px",
                                fontSize: getInputFontSize(), // 👈 dynamic font size here
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
