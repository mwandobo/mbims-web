
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
    layout?: "row" | "column" | "none";
    inputSize?: "xs" | "sm" | "md" | "lg";
    onChange: (e: any, from: string) => void;
}

const FileInputComponent = ({
                                onChange,
                                label,
                                from,
                                layout = "none",
                                inputSize = "md",
                                isDisabled,
                                isRequired,
                                errorMessage,
                            }: FileFieldProps) => {
    const [fileName, setFileName] = useState<string>("");

    /** 🔹 Render red asterisk for required fields */
    const renderRequiredAsterisk = () => (
        <span style={{ color: "red", marginLeft: "4px" }}>*</span>
    );

    /** 🔹 Tailwind label size based on `inputSize` */
    const getLabelClass = () => {
        switch (inputSize) {
            case "xs": return "text-lg";
            case "sm": return "text-xl";
            case "md": return "text-2xl";
            case "lg": return "text-4xl";
            default: return "text-xl";
        }
    };

    /** 🔹 Input height based on `inputSize` */
    const getInputHeight = () => {
        switch (inputSize) {
            case "xs": return 32;
            case "sm": return 40;
            case "md": return 48;
            case "lg": return 56;
            default: return 40;
        }
    };

    /** 🔹 Input font size for file name */
    const getInputFontSize = () => {
        switch (inputSize) {
            case "xs": return "1.125rem";
            case "sm": return "1.25rem";
            case "md": return "1.4rem";
            case "lg": return ".25rem";
            default: return "1rem";
        }
    };

    /** 🔹 Input font size for file name */
    const getButtonSize = () => {
        switch (inputSize) {
            case "xs": return "0.123rem";
            case "sm": return "1rem";
            case "md": return "1rem";
            case "lg": return "1rem";
            default: return "1rem";
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
                layout === "row"
                    ? "flex items-center gap-4 mb-4"
                    : layout === "column" || layout === "none"
                        ? "flex flex-col mb-4"
                        : "mb-4"
            }
        >
            {/* Label for row/column layout */}
            {(layout === "row" || layout === "column") && label && (
                <label className={`text-black ${getLabelClass()} flex items-center`}>
                    {label}
                    {isRequired && renderRequiredAsterisk()}
                </label>
            )}

            <div className="flex-1 relative">
                {errorMessage && (
                    <p className="text-red-500 mb-1 text-xs">{errorMessage}</p>
                )}

                {/* Hidden file input */}
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
                        fontSize: getInputFontSize(), // 🔹 dynamic font size applied here
                        color: 'rgb(55, 65, 81)', // gray-700 in RGB
                        paddingRight: "10px",
                        backgroundColor: isDisabled ? "#f5f5f5" : "#fff",
                    }}
                >
    <span
        style={{
            fontSize: getInputFontSize(), // 🔹 make sure span inherits font size
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
        }}
    >
        {fileName || "No file selected"}
    </span>
                    <Button
                        variant="contained"
                        component="span"
                        disabled={isDisabled}
                        sx={{ ml: 2, fontSize: getButtonSize(), }}
                    >
                        Browse
                    </Button>
                </div>

            </div>
        </div>
    );
};

export default FileInputComponent;
