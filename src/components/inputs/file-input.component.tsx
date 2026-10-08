import React, { useState } from "react";
import { Input, Button } from "@mui/material";

interface FileFieldProps {
    placeholder?: string;
    isDisabled?: boolean;
    isRequired?: boolean;
    isError?: boolean;
    label?: string;
    value?: string;
    type?: string;
    from: string;
    errorMessage?: string;
    layout?: string;
    inputSize?: string;
    onChange: (e: any, from: string) => void;
}

const FileInputComponent = ({
                                onChange,
                                label,
                                from,
                                layout,
                                inputSize = "md",
                                isDisabled,
                                isRequired,
                                errorMessage,
                            }: FileFieldProps) => {
    const [fileName, setFileName] = useState<string>("");

    const effectiveLayout =
        layout === "row" || layout === "none" ? layout : "column";

    const renderRequiredAsterisk = () => (
        <span className="text-error ml-1">*</span>
    );

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

    const getInputHeight = () => {
        switch (inputSize) {
            case "xs":
                return 32;
            case "sm":
                return 40;
            case "md":
                return 48;
            case "lg":
                return 56;
            default:
                return 40;
        }
    };

    const getInputFontSize = () => {
        switch (inputSize) {
            case "xs":
                return "0.9rem";
            case "sm":
                return "1rem";
            case "md":
                return "1.1rem";
            case "lg":
                return "1.25rem";
            default:
                return "1rem";
        }
    };

    const getButtonSize = () => {
        switch (inputSize) {
            case "xs":
                return "0.7rem";
            case "sm":
                return "0.85rem";
            case "md":
                return "1rem";
            case "lg":
                return "1.1rem";
            default:
                return "1rem";
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) setFileName(file.name);
        onChange(event, from);
    };

    return (
        <div
            className={
                effectiveLayout === "row"
                    ? "flex items-center gap-4 mb-4"
                    : "flex flex-col mb-4"
            }
        >
            {(effectiveLayout === "row" || effectiveLayout === "column") && label && (
                <label
                    className={`text-foreground ${getLabelClass()} flex items-center`}
                >
                    {label}
                    {isRequired && renderRequiredAsterisk()}
                </label>
            )}

            <div className="flex-1 relative">
                {errorMessage && (
                    <p className="text-error mb-1 text-xs">{errorMessage}</p>
                )}

                <Input
                    type="file"
                    onChange={handleFileChange}
                    disabled={isDisabled}
                    sx={{
                        opacity: 0,
                        position: "absolute",
                        zIndex: 1,
                        width: "100%",
                        height: getInputHeight(),
                        cursor: "pointer",
                    }}
                />

                <div
                    className="border rounded px-3 flex items-center justify-between"
                    style={{
                        height: getInputHeight(),
                        fontSize: getInputFontSize(),
                        color: fileName
                            ? "var(--input-text)"
                            : "var(--input-placeholder)",
                        paddingRight: "10px",
                        backgroundColor: isDisabled
                            ? "var(--muted-bg)"
                            : "var(--card-bg)",
                        borderColor: "var(--input-border)",
                    }}
                >
          <span
              style={{
                  fontSize: getInputFontSize(),
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  flex: 1,
              }}
          >
            {fileName || "No file selected"}
          </span>

                    <Button
                        variant="contained"
                        component="span"
                        disabled={isDisabled}
                        sx={{
                            ml: 2,
                            fontSize: getButtonSize(),
                            backgroundColor: "var(--button-bg)",
                            color: "var(--button-text)",
                            boxShadow: "none",
                            "&:hover": {
                                backgroundColor: "var(--button-hover-bg)",
                                color: "var(--button-hover-text)",
                                boxShadow: "none",
                            },
                            "&.Mui-disabled": {
                                backgroundColor: "var(--muted-bg)",
                                color: "var(--text-disabled)",
                            },
                        }}
                    >
                        Browse
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default FileInputComponent;