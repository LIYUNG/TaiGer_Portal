import React from 'react';
import { Autocomplete, TextField, Chip, Box } from '@mui/material';

const SearchableMultiSelect = ({
  options,
  value = [],
  setValue,
  chipColoring = {},
  label = 'Select Options',
  ...props
}) => {
  return (
    <div>
      <Autocomplete
        multiple
        id="searchable-multi-select"
        options={options}
        value={value}
        onChange={(e, newValue) => setValue(newValue)}
        disableCloseOnSelect
        getOptionLabel={(option) => option}
        renderInput={(params) => (
          <TextField {...params} label={label || 'Select Options'} />
        )}
        renderOption={(props, option) => {
          const { key, ...rest } = props;
          const isSelected = value.includes(option);

          return (
            <li
              key={key}
              {...rest}
              style={{
                color: isSelected ? 'darkgrey' : 'inherit',
                backgroundColor: isSelected ? 'lightgrey' : 'transparent'
              }}
            >
              {option}
            </li>
          );
        }}
        renderTags={(value, getTagProps) => (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {value.map((option, index) => {
              const { key, ...tagProps } = getTagProps({ index });
              return (
                <Chip
                  key={key}
                  label={option}
                  variant="outlined"
                  color={chipColoring[option] || 'primary'}
                  {...tagProps}
                />
              );
            })}
          </Box>
        )}
        {...props}
      />
    </div>
  );
};

export default SearchableMultiSelect;
