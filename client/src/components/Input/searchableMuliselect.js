import React from 'react';
import { Autocomplete, TextField, Chip, Box } from '@mui/material';

/**
 * A searchable multi-select dropdown component built with Material-UI's Autocomplete.
 * Supports single-column or multi-column data representation with customizable colors and labels.
 *
 * @component
 * @param {Object|Array<string>} data - The data to populate the dropdown.
 * - If an object, it should have a structure of `{ key: { label: string, color: string } }`.
 *   - `key` is the value of the option.
 *   - `label` is displayed as an additional column in the dropdown.
 *   - `color` (optional) specifies the color of the Chip in the selected tags.
 * - If an array, it should be a flat array of strings `[key1, key2, ...]`, which will be displayed in a single column.
 * @param {Array<string>} value - The currently selected options.
 * @param {Function} setValue - Callback to update the selected options.
 *   - Function signature: `setValue(newValue: Array<string>) => void`.
 * @param {string} [label='Select Options'] - The label for the input field.
 * @param {Object} props - Additional props passed to the Material-UI `Autocomplete` component.
 * @example
 * // Example with object-based data
 * const data = {
 *   AMZN: { label: 'Amazon.com, Inc.', color: 'secondary' }
 *   AKAM: { label: 'Akamai Technologies, Inc.', color: 'secondary' }
 *   AAPL: { label: 'Apple Inc.', color: 'primary' },
 *   GOOGL: { label: 'Alphabet Inc.', color: 'primary' },
 *   META: { label: 'Meta Platforms, Inc.', color: 'primary' },
 *   NVDA: { label: 'NVIDIA Corporation', color: 'secondary' }
 * };
 * const [selectedOptions, setSelectedOptions] = useState([]);
 *
 * <SearchableMultiSelect
 *   data={data}
 *   value={selectedOptions}
 *   setValue={setSelectedOptions}
 *   label="Choose Options"
 * />
 *
 * @example
 * // Example with array-based data
 * const data = ['AMZN', 'AKAM', 'AAPL', 'GOOGL', 'META', 'NVDA'];
 * const [selectedOptions, setSelectedOptions] = useState([]);
 *
 * <SearchableMultiSelect
 *   data={data}
 *   value={selectedOptions}
 *   setValue={setSelectedOptions}
 *   label="Select Items"
 * />
 */
const SearchableMultiSelect = ({
    data,
    value,
    setValue,
    label = 'Select Options',
    ...props
}) => {
    const handleValueChange = (event, newValue) => {
        setValue(newValue);
    };

    const options = Array.isArray(data) ? data : Object.keys(data);
    return (
        <div>
            <Autocomplete
                disableCloseOnSelect
                filterOptions={(options, { inputValue }) => {
                    const searchString = inputValue.toLowerCase();
                    const getSearchTarget = (option) =>
                        Array.isArray(data)
                            ? option
                            : option?.concat(data?.[option]?.label || '');

                    const filteredSelected =
                        value?.filter((option) => {
                            return getSearchTarget(option)
                                ?.toLowerCase()
                                .includes(searchString);
                        }) || [];

                    const filteredUnselected =
                        options?.filter(
                            (option) =>
                                !value?.includes(option) &&
                                getSearchTarget(option)
                                    .toLowerCase()
                                    .includes(searchString)
                        ) || [];

                    return [...filteredSelected, ...filteredUnselected];
                }}
                id="searchable-multi-select"
                multiple
                onChange={handleValueChange}
                options={options}
                renderInput={(params) => (
                    <TextField {...params} label={label} />
                )}
                // customize dropdown options
                renderOption={(props, option) => {
                    const { key, ...rest } = props;
                    const isSelected = value?.includes(option);

                    return (
                        <li
                            key={key}
                            {...rest}
                            style={{
                                fontWeight: isSelected ? 700 : 400,
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '8px',
                                gap: '16px'
                            }}
                        >
                            {!Array.isArray(data) && data?.[option]?.label ? (
                                <span>{data?.[option].label}</span>
                            ) : null}
                            <span>{option}</span>
                        </li>
                    );
                }}
                // customize selected tags
                renderTags={(value, getTagProps) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {value.map((option, index) => {
                            const { key, ...tagProps } = getTagProps({ index });
                            return (
                                <Chip
                                    key={key}
                                    label={option}
                                    sx={{
                                        backgroundColor: Array.isArray(data)
                                            ? 'primary'
                                            : data?.[option]?.color || 'primary'
                                    }}
                                    {...tagProps}
                                />
                            );
                        })}
                    </Box>
                )}
                // filter dropdown options based on search input -> display selected options first
                value={value}
                {...props}
            />
        </div>
    );
};

export default SearchableMultiSelect;
