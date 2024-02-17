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
          <MenuItem value="">Please Select</MenuItem>
          <MenuItem value="ML">ML</MenuItem>
          <MenuItem value="Essay">Essay</MenuItem>
          <MenuItem value="Portfolio">Portfolio</MenuItem>
          <MenuItem value="Internship_Form">Internship Form</MenuItem>
          <MenuItem value="Supplementary_Form">Supplementary Form</MenuItem>
          <MenuItem value="Scholarship_Form">Scholarship Form / ML</MenuItem>
          <MenuItem value="RL_A">RL (Referee A)</MenuItem>
          <MenuItem value="RL_B">RL (Referee B)</MenuItem>
          <MenuItem value="RL_C">RL (Referee C)</MenuItem>
          <MenuItem value="Others">Others</MenuItem>
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
            {t('Create')}
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
            {t('Create')}
          </Button>
        )}
      </Grid>
    </Grid>
  );
}

export default ToggleableUploadFileForm;
