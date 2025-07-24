import React, { useEffect, useState } from 'react';
import { Select, FormControl, InputLabel, MenuItem, SelectChangeEvent } from '@mui/material';
import { getRequest } from "@/utils/api-calls.util";
import CreateOptionsForSelect from "@/utils/create-options-for-select";

interface Props {
  handleChange: (event: any, from: string, control_for: string, control_type: string) => void
  rows?: number;
  placeholder?: string;
  label?: string;
  from: string;
  isDisabled?: boolean;
  isRequired?: boolean;
  optionsUrlData?: string;
  optionDataKey?: string;
  value: any;
  error?: string
  control?: string
  control_id?: string
  control_for?: string
  control_type?: string
}

const MuiSelect = ({
  handleChange,
  optionsUrlData,
  optionDataKey,
  from,
  isDisabled,
                     isRequired,
  placeholder = 'Enter your text here...',
  value,
  error,
  label = '',
  control,
  control_for,
                     control_type
}: Props) => {

  const onChange = (event: SelectChangeEvent) => {
    return handleChange(event, from, control_for, control_type)
  };

  const assumptionOptions = [
    { label: "Assumption", value: "assumption" },
    { label: "Constraint", value: "assumption" }
  ]

  const [options, setOptions] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await getRequest(optionsUrlData)

      if (res && res.status === 200) {
        const payload = CreateOptionsForSelect(res.data, optionDataKey)

        setOptions(payload)
      }
    };

    if (control === "assumption") {
      setOptions(assumptionOptions)

    } else {
      fetchData()
    }
  }, [optionsUrlData]);


  console.log('value in select', value)

  return (
    <>
      {error && <p className="text-red-400 mb-2" style={{fontSize: '12px'}}>{error}</p>
      }
      <FormControl fullWidth>
        <InputLabel
          id={`${label}-select-label`}
          style={{
            display: 'flex',
            fontSize: '16px',
            justifyContent: 'center',
            marginTop: "-5px",
            color: 'black'
          }}
        >
          {isRequired ? (
              <span style={{ display: "flex", alignItems: "center" }}>
              {label}{" "}
                <span
                    style={{
                      color: "red",
                      marginLeft: "4px",
                      fontSize: "16px",
                    }}
                >
                *
              </span>
            </span>
          ) : (
              label
          )}        </InputLabel>
        <Select
          labelId={`${label}-select-label`}
          id={`${label}-select`}
          value={value}
          label={label}
          onChange={onChange}
          disabled={isDisabled}
          required={isRequired}
          size="medium"
          style={{
            marginBottom: "20px"
          }}
        >
          {options && options.length > 0 &&
            options.map((option: any) => (
              < MenuItem
                key={option.value}
                value={option.value}
                style={{
                  fontSize: '16px'
                }}
              >
                {option.label}
              </MenuItem>
            ))}
        </Select>
      </FormControl >

    </>
  )
};

export default MuiSelect;
