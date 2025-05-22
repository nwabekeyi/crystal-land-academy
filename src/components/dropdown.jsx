import React, { useState } from 'react';
import { MenuItem, Select, FormControl, InputLabel } from '@mui/material';

const Dropdown = ({ label, options, onSelect }) => {
  // Use state to control the selected value
  const [selectedValue, setSelectedValue] = useState("");

  const handleChange = (event) => {
    const value = event.target.value;
    setSelectedValue(value); // Update the selected value
    onSelect(value); // Pass the selected value to the parent component
  };

  return (
    <FormControl
      sx={{ width: "170px", paddingBottom: '2%' }}
      variant="outlined"
    >
      <InputLabel id={`${label}-select-label`}>{label}</InputLabel>
      <Select
        labelId={`${label}-select-label`}
        value={selectedValue}  // Use dynamic value here
        onChange={handleChange}
        label={label}
      >
        <MenuItem value="" disabled>{`Select ${label}`}</MenuItem>
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default Dropdown;
