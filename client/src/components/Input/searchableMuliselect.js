import React from 'react';
import { Autocomplete, TextField, Chip, Box } from '@mui/material';

const SearchableMultiSelect = ({
  data,
  value = [],
  setValue,
  label = 'Select Options',
  ...props
}) => {
  // Map the selected value to corresponding keys
  const handleValueChange = (event, newValue) => {
    setValue(
      newValue.map((option) =>
        typeof option === 'object' ? option.key : option
      )
    );
  };

  const options = Object.keys(data);

  return (
    <div>
      <Autocomplete
        multiple
        id="searchable-multi-select"
        options={options}
        value={options.filter((option) =>
          value.includes(typeof option === 'object' ? option.key : option)
        )}
        onChange={handleValueChange}
        disableCloseOnSelect
        getOptionLabel={(option) =>
          typeof data instanceof Array
            ? option
            : data?.[option]?.label || option
        }
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
                backgroundColor: isSelected ? 'lightgrey' : 'transparent',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '8px',
                gap: '16px'
              }}
            >
              <span>{option}</span>
              {!(typeof data instanceof Array) && (
                <span style={{ fontSize: 'smaller', color: 'grey' }}>
                  {data?.[option].label}
                </span>
              )}
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
                  color={
                    typeof data instanceof Array
                      ? 'primary'
                      : data?.[option].color || 'primary'
                  }
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
