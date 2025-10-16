import React from 'react';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import { InputLabel, styled } from '@mui/material';

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

const StyledTextareaAutosize = styled(TextareaAutosize)(({ theme }) => ({
    '&::placeholder': {
        color: 'black',
        fontStyle: 'italic',
    },
    width: '100%',
    border: '2px solid #d1d1d1',
    borderRadius: '5px',
    padding: '6px 10px',
    color: 'black',
    marginBottom: '10px',
    fontFamily: 'inherit',
    resize: 'vertical',
    '&:focus': {
        outline: 'none',
        borderColor: 'rgb(24, 118, 209)',
    },
}));

const TextArea = ({
                      value,
                      onChange,
                      from,
                      rows = 4,
                      label,
                      error,
                      placeholder = 'Enter your text here...',
                      inputSize = 'md',
                  }: Props) => {
    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        onChange(event, from);
    };

    /** 🔹 Adjust font sizes based on `size` prop */
    const getFontSizes = () => {
        switch (inputSize) {
            case 'xs':
                return { label: '12px', text: '13px' };
            case 'sm':
                return { label: '13px', text: '14px' };
            case 'md':
                return { label: '16px', text: '17px' };
            case 'lg':
                return { label: '16px', text: '17px' };
            default:
                return { label: '14px', text: '15px' };
        }
    };

    const { label: labelSize, text: textSize } = getFontSizes();

    return (
        <>
            {label && (
                <InputLabel
                    id={`${label}-select-label`}
                    style={{
                        fontSize: labelSize,
                        color: 'black',
                        marginBottom: '4px',
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
                    fontSize: textSize,
                    fontWeight: '300',
                }}
            />

            {error && <p className="text-red-700 text-sm ps-3">{error}</p>}
        </>
    );
};

export default TextArea;
