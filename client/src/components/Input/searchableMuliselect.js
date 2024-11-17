import React, { useState } from 'react';
import { Autocomplete, TextField, Chip, Box } from '@mui/material';

const options = [
  'ACC-FIN',
  'AG-FOR',
  'ANA-PHYS',
  'ANTH',
  'ARCH',
  'ARCH-BE',
  'ART-DES',
  'ARTH',
  'BIO-SCI',
  'BUS-MGMT',
  'CHEM',
  'CLAH',
  'COMM-MEDIA',
  'CSIS',
  'DS-AI',
  'DENT',
  'DEV-STUD',
  'EAR-MAR-SCI',
  'ECON',
  'EDU-TRAIN',
  'CHEM-ENG',
  'CIV-STR-ENG',
  'ELEC-ENG',
  'MECH-ENG',
  'MIN-MIN-ENG',
  'PETRO-ENG',
  'ELL',
  'ENV-SCI',
  'GEO',
  'GEOL',
  'GEOPH',
  'HIST',
  'HOSP-MGMT',
  'LAW',
  'LIB-INFO',
  'LING',
  'MKT',
  'MAT-SCI',
  'MATH',
  'MED',
  'MOD-LANG',
  'MUS',
  'NURS',
  'PERF-ART',
  'PHARM',
  'PHIL',
  'PHYS-ASTRO',
  'POL',
  'PSYCH',
  'SOC-POL',
  'SOC',
  'SPORT',
  'STAT-OR',
  'THEO',
  'VET-SCI'
];

const SearchableMultiSelect = () => {
  const [selectedValues, setSelectedValues] = useState([]);

  const handleChange = (event, newValue) => {
    setSelectedValues(newValue); // Store selected options
  };

  return (
    <div>
      <Autocomplete
        multiple
        id="searchable-multi-select"
        options={options} // Data to select from
        value={selectedValues} // Currently selected options
        onChange={handleChange} // Update selected values on change
        disableCloseOnSelect // Keep the dropdown open after selecting
        getOptionLabel={(option) => option} // Specify how the options should be rendered
        renderInput={(params) => (
          <TextField {...params} label="Select People" />
        )}
        renderTags={(value, getTagProps) => (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {value.map((option, index) => (
              <Chip
                key={option}
                label={option}
                variant="outlined"
                {...getTagProps({ index })}
              />
            ))}
          </Box>
        )}
      />
    </div>
  );
};

export default SearchableMultiSelect;
