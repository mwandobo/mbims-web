import { CircularProgress } from "@mui/material";
import { ReactNode } from "react";

interface Props {
    name?: string;
    onClick?: () => void;
    children?: ReactNode;
    type?: "button" | "submit" | "reset";
    isDisabled?: boolean;
    isLoading?: boolean;
    isEndIcon?: boolean;
    rounded?: string;
    padding?: string;
    isSmallButton?: boolean;
    /** Optional overrides – leave empty to use theme */
    className?: string;
}

export function ButtonComponent({
                                    name,
                                    onClick,
                                    children,
                                    type = "button",
                                    isDisabled = false,
                                    isLoading = false,
                                    isEndIcon = false,
                                    rounded = "md",
                                    padding = "p-2",
                                    isSmallButton = false,
                                    className = "",
                                }: Props) {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={isDisabled || isLoading}
            style={{ fontSize: isSmallButton ? "8px" : undefined }}
            className={`
        inline-flex items-center justify-center gap-1 text-xs
        bg-button-bg text-button-text border border-button-border
        hover:bg-button-hover-bg hover:text-button-hover-text
        active:bg-button-active-bg active:text-button-active-text
        disabled:opacity-50 disabled:cursor-not-allowed
        shadow-md ${padding} rounded-${rounded}
        ${className}
      `}
        >
            {isLoading ? (
                <CircularProgress size={16} color="inherit" />
            ) : (
                <>
                    {isEndIcon ? (
                        <>
                            {name}
                            {children}
                        </>
                    ) : (
                        <>
                            {children}
                            {name}
                        </>
                    )}
                </>
            )}
        </button>
    );
}