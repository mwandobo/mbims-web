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
        color: 'rgb(55, 65, 81)', // gray-700 in RGB
        fontStyle: 'italic',
        opacity: 0.7,
    },
    width: '100%',
    border: '2px solid #d1d1d1',
    borderRadius: '5px',
    padding: '6px 10px',
    color: 'rgb(55, 65, 81)', // gray-700 in RGB
    marginBottom: '10px',
    fontFamily: 'inherit',
    resize: 'vertical',
    '&:focus': {
        outline: 'none',
        borderColor: 'rgb(24, 118, 209)',
    },
    backgroundColor: 'white',
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
                return { label: '1.125rem', text: '13px' };
            case 'sm':
                return { label: '1.25rem', text: '14px' };
            case 'md':
                return { label: '1.5rem', text: '17px' };
            case 'lg':
                return { label: '2.25rem', text: '17px' };
            default:
                return { label: '1.5rem', text: '15px' };
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
                        color: 'black', // gray-700 in RGB
                        marginBottom: '4px',
                        fontWeight: '500',
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
                    color: 'rgb(55, 65, 81)', // gray-700 in RGB
                }}
            />

            {error && <p className="text-red-700 text-sm ps-3">{error}</p>}
        </>
    );
};

export default TextArea;