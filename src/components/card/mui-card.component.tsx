import { Card } from "@mui/material";
import React, { ReactNode } from "react";

type Props = {
    children?: ReactNode;
    text?: string;
    className?: string;
};

const MuiCardComponent = ({ children, className = "" }: Props) => {
    return (
        <Card
            className={className}
            sx={{
                padding: "20px 10px",
                marginBottom: "10px",
                backgroundColor: "var(--card-bg)",
                color: "var(--foreground)",
                borderTop: "1px solid var(--card-border)",
                border: "1px solid var(--card-border)",
                boxShadow: "none",
            }}
        >
            {children}
        </Card>
    );
};

export default MuiCardComponent;