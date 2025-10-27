export const getLabelClass = (inputSize) => {
    switch (inputSize) {
        case "xs":
            return "text-md";
        case "sm":
            return "text-sm";
        case "md":
            return "text-lg";
        case "lg":
            return "text-xl";
        default:
            return "text-lg";
    }
};

/** 🔹 Get select height */
export const getInputHeight = (inputSize) => {
    switch (inputSize) {
        case "xs":
            return 32;
        case "sm":
            return 40;
        case "md":
            return 48;
        case "lg":
            return 64;
        default:
            return 48;
    }
};

/** 🔹 Get text font size */
export const getTextFontSize = (inputSize) => {
    switch (inputSize) {
        case "xs":
            return "0.6rem";
        case "sm":
            return "0.8rem";
        case "md":
            return "1rem";
        case "lg":
            return "1.4rem";
        default:
            return "1rem";
    }
};

export const getLabelStyle = (inputSize) => {
    switch (inputSize) {
        case "xs":
            return "text-[1rem]"; // was text-md
        case "sm":
            return "text-[0.875rem]"; // text-sm
        case "md":
            return "text-[1.125rem]"; // text-lg
        case "lg":
            return "text-[1.25rem]"; // text-xl
        default:
            return "text-[1.125rem]"; // default to text-lg equivalent
    }
};