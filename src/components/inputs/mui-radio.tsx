import React from 'react';
import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material';

export default function MuiRadioButtonsGroup({ label, options, from, onChange, value }) {
    // Remove internal state, use the value prop directly

    const handleChange = (event) => {
        onChange(event, from);
    };

    console.log('radio value', value);

    return (
        <FormControl>
            <FormLabel id={`${from}-label`}>{label}</FormLabel>
            <RadioGroup
                row
                aria-labelledby={`${from}-label`}
                name={from}
                value={value ?? ''} // use passed value
                onChange={handleChange}
            >
                {options.map(option => (
                    <FormControlLabel
                        sx={{
                            color: '#000',
                            fontWeight: '600',
                            marginBottom: '8px',
                        }}
                        key={option.value}
                        value={option.value}
                        control={<Radio />}
                        label={option.label}
                        disabled={option.disabled}
                    />
                ))}
            </RadioGroup>
        </FormControl>
    );
}
