import { useTranslation } from 'react-i18next';
import React, { Fragment } from 'react';
import { List, ListItem, TextField, Typography } from '@mui/material';

export const StudentPreferenceCard = (props) => {
  const { t } = useTranslation();
  return (
    <Fragment>
      <Typography variant="h6">
        {t('Application Preference From Survey')}
      </Typography>
      <List
        sx={{
          width: '100%',
          bgcolor: 'background.paper',
          position: 'relative',
          overflow: 'auto',
          '& ul': { padding: 0 }
        }}
        subheader={<li />}
      >
        <ListItem>
          {t('Target Application Fields')}:{' '}
          <b>
            {props.student.application_preference?.target_application_field}
          </b>
        </ListItem>
        <ListItem>
          {t('Target Degree Programs')}:{' '}
          <b>{props.student.application_preference?.target_degree}</b>
        </ListItem>
        <ListItem>
          {t('Target Program Language')}:{' '}
          <b>{props.student.application_preference?.target_program_language}</b>
        </ListItem>
        <ListItem>
          {t(
            'Considering private universities? (Tuition Fee: ~15000 EURO/year)'
          )}
          :{' '}
          <b>
            {
              props.student.application_preference
                ?.considered_privat_universities
            }
          </b>
        </ListItem>
        <ListItem>
          {t('Considering universities outside Germany?')}:{' '}
          <b>
            {props.student.application_preference?.application_outside_germany}
          </b>
        </ListItem>
        <ListItem>
          {t('Other wish', { ns: 'survey' })}:
          <TextField
            id="special_wished"
            multiline
            fullWidth
            rows={4}
            readOnly
            value={props.student.application_preference?.special_wished || ''}
            variant="standard"
          />
        </ListItem>
      </List>
    </Fragment>
  );
};
