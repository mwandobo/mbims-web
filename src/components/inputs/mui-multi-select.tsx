import * as React from 'react';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import { useEffect, useState } from 'react';
import { getRequest } from "@/utils/api-calls.util";
import CreateOptionsForSelect from "@/utils/create-options-for-select";

interface Option {
    value: number;
    label: string;
}

interface Props {
    optionsUrlData: string;
    optionDataKey: string;
    from: string;
    isSmall?: boolean;
    label?: string;
    labelStyle?: string;
    placeholder?: string;
    value: number[];
    handleChange: (event: SelectChangeEvent<number[]>, from?: string) => void;
}

export default function MuiMultiSelectSelect({
                                                 optionsUrlData,
                                                 optionDataKey,
                                                 handleChange,
                                                 from,
                                                 placeholder,
                                                 label,
                                                 labelStyle,
                                                 isSmall,
                                                 value,
                                             }: Props) {
    const [selected, setSelected] = useState<number[]>(value ?? []);
    const [options, setOptions] = useState<Option[]>([]);

    useEffect(() => {
        let isMounted = true;
        const fetchData = async () => {
            try {
                const res = await getRequest(optionsUrlData);
                if (isMounted && res?.status === 200) {
                    const payload = CreateOptionsForSelect(res.data.data, optionDataKey);
                    setOptions(payload);
                }
            } catch (error) {
                console.error('API Error:', error);
            }
        };

        fetchData();
        return () => { isMounted = false; };
    }, [optionDataKey, optionsUrlData]);

    useEffect(() => {
        setSelected(value ?? []);
    }, [value]);

    const onChange = (event: SelectChangeEvent<number[]>) => {
        const { target: { value } } = event;
        const newValue = typeof value === 'string'
            ? value.split(',').map(Number)
            : value;

        setSelected(newValue);
        handleChange({ ...event, target: { ...event.target, value: newValue } }, from);
    };

    const renderBody = (passed_label?: string) => (
        <FormControl
            sx={{
                width: '100%',
                marginBottom: '5px',
                '& .MuiOutlinedInput-root': isSmall
                    ? { height: '35px', fontSize: '12px', padding: '6px' }
                    : {},
                '& .MuiInputLabel-root': isSmall ? { fontSize: '12px' } : {},
                '& .MuiSvgIcon-root': isSmall ? { fontSize: '18px' } : {},
            }}
        >
            {passed_label && (
                <InputLabel
                    sx={{ fontWeight: 500, color: 'black', fontSize: isSmall ? '12px' : 'inherit' }}
                    id="multi-select-label"
                >
                    {passed_label}
                </InputLabel>
            )}
            <Select
                className="w-full"
                labelId="multi-select-label"
                id="multi-select-checkbox"
                multiple
                value={selected}
                onChange={onChange}
                placeholder={placeholder}
                input={<OutlinedInput label={passed_label} />}
                renderValue={(selected) => (
                    <span style={{ fontSize: isSmall ? '12px' : '16px' }}>
            {selected
                .map((id) => options.find((option) => option.value === id)?.label)
                .filter(Boolean) // Filter out undefined
                .join(', ')}
          </span>
                )}
                MenuProps={{
                    PaperProps: {
                        sx: {
                            '& .MuiMenuItem-root': {
                                fontSize: isSmall ? '12px' : '16px',
                                padding: isSmall ? '5px 10px' : '10px 20px',
                            },
                            maxHeight: isSmall ? 200 : 300,
                        },
                    },
                }}
                sx={{
                    '& .MuiSelect-select': { fontSize: isSmall ? '12px' : '16px' },
                }}
            >
                {options.map((option) => (
                    <MenuItem
                        key={option.value}
                        value={option.value}
                        sx={{
                            fontSize: isSmall ? '12px' : '16px',
                            padding: isSmall ? '5px 10px' : '10px 20px',
                        }}
                    >
                        <Checkbox checked={selected.includes(option.value)} />
                        <ListItemText primary={option.label} />
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );

    return (
        <div className="w-full">
            {labelStyle === 'row' ? (
                <div className="flex w-full justify-center items-center gap-2">
                    <p className="min-w-[100px] max-w-[150px] text-right text-xs font-medium text-gray-700 truncate flex flex-col justify-center">
                        {label}
                    </p>
                    <div className="flex-1">{renderBody()}</div>
                </div>
            ) : (
                <div>{renderBody(label)}</div>
            )}
        </div>
    );
}