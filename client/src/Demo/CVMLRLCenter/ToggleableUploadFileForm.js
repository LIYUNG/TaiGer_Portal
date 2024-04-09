import {
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select
} from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
const GENERAL_FILE_TYPE = [
  { name: 'Please Select', value: '' },
  { name: 'CV', value: 'CV' },
  { name: 'Recommendation Letter (A)', value: 'Recommendation_Letter_A' },
  { name: 'Recommendation Letter (B)', value: 'Recommendation_Letter_B' },
  { name: 'Recommendation Letter (C)', value: 'Recommendation_Letter_C' },
  { name: 'Form A', value: 'Form_A' },
  { name: 'Form_B', value: 'Form_B' },
  { name: 'Others', value: 'Others' }
];
const PROGRAM_SPECIFIC_FILE_TYPE = [
  { name: 'Please Select', value: '' },
  { name: 'ML', value: 'ML' },
  { name: 'Essay', value: 'Essay' },
  { name: 'Portfolio', value: 'Portfolio' },
  { name: 'Internship Form', value: 'Internship_Form' },
  { name: 'Supplementary Form', value: 'Supplementary_Form' },
  { name: 'Curriculum_Analysis', value: 'Curriculum_Analysis' },
  { name: 'Scholarship Form / ML', value: 'Scholarship_Form' },
  { name: 'RL (Referee A)', value: 'RL_A' },
  { name: 'RL (Referee B)', value: 'RL_B' },
  { name: 'RL (Referee C)', value: 'RL_C' },
  { name: 'Others', value: 'Others' }
];
function ToggleableUploadFileForm(props) {
  const { t } = useTranslation();
  const FILETYPE =
    props.filetype === 'General'
      ? GENERAL_FILE_TYPE
      : PROGRAM_SPECIFIC_FILE_TYPE;

  return (
    <Grid container spacing={2}>
      <Grid item xs={8} md={8}>
        <FormControl fullWidth size="small">
          <InputLabel id="thread_category">
            {t('Category', { ns: 'common' })}
          </InputLabel>
          <Select
            labelId="thread_category"
            name="thread_category"
            id="thread_category"
            label={t('Category', { ns: 'common' })}
            onChange={(e) => props.handleSelect(e)}
            value={props.category}
          >
            {FILETYPE.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={4} md={4}>
        {props.filetype === 'General' ? (
          <Button
            color="primary"
            variant="contained"
            onClick={(e) =>
              props.handleCreateGeneralMessageThread(
                e,
                props.student._id,
                props.category
              )
            }
          >
            {t('Add Task', { ns: 'common' })}
          </Button>
        ) : (
          <Button
            color="primary"
            variant="contained"
            onClick={(e) =>
              props.handleCreateProgramSpecificMessageThread(
                e,
                props.student._id,
                props.application.programId._id,
                props.category
              )
            }
          >
            {t('Add Task', { ns: 'common' })}
          </Button>
        )}
      </Grid>
    </Grid>
  );
}

export default ToggleableUploadFileForm;
