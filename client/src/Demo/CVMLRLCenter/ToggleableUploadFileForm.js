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

function ToggleableUploadFileForm(props) {
  const { t } = useTranslation();
  var drop_list;

  if (props.filetype === 'General') {
    drop_list = (
      <FormControl fullWidth size="small">
        <InputLabel id="thread_category">{t('Category')}</InputLabel>
        <Select
          labelId="thread_category"
          name="thread_category"
          id="thread_category"
          label={t('Category')}
          onChange={(e) => props.handleSelect(e)}
          value={props.category}
        >
          <MenuItem value="">Please Select</MenuItem>
          <MenuItem value="CV">CV</MenuItem>
          <MenuItem value="Recommendation_Letter_A">
            Recommendation Letter (A)
          </MenuItem>
          <MenuItem value="Recommendation_Letter_B">
            Recommendation Letter (B)
          </MenuItem>
          <MenuItem value="Recommendation_Letter_C">
            Recommendation Letter (C)
          </MenuItem>
          <MenuItem value="Form_A">Form A</MenuItem>
          <MenuItem value="Form_B">Form B</MenuItem>
          <MenuItem value="Others">Others</MenuItem>
        </Select>
      </FormControl>
    );
  } else {
    const PROGRAM_SPECIFIC_FILTE_TYPE = [
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
    drop_list = (
      <FormControl fullWidth size="small">
        <InputLabel id="thread_category">{t('Category')}</InputLabel>
        <Select
          labelId="thread_category"
          name="thread_category"
          id="thread_category"
          value={props.category}
          label={t('Category')}
          onChange={(e) => props.handleSelect(e)}
        >
          {PROGRAM_SPECIFIC_FILTE_TYPE.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  }
  return (
    <Grid container spacing={2}>
      <Grid item xs={8} md={8}>
        {drop_list}
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
