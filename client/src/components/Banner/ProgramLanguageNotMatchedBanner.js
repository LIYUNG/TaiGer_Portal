import React from 'react';
import { Link as LinkDom } from 'react-router-dom';
import { Alert, Card, Link, ListItem } from '@mui/material';
import {
  isLanguageNotMatchedInAnyProgram,
  languageNotMatchedPrograms
} from '../../Demo/Utils/checking-functions';
import { useTranslation } from 'react-i18next';
import DEMO from '../../store/constant';

export default function ProgramLanguageNotMatchedBanner(props) {
  const { t } = useTranslation();
  return (
    <>
      {isLanguageNotMatchedInAnyProgram(props.student) && (
        <Card sx={{ border: '4px solid red' }}>
          <Alert severity="warning">
            {t('Programs below require the language that does not match to your background if your survey.', {
              ns: 'common'
            })}
            &nbsp;:&nbsp;
          </Alert>
          {languageNotMatchedPrograms(props.student)?.map((app) => (
            <ListItem key={app.programId._id.toString()}>
              <Link
                to={DEMO.SINGLE_PROGRAM_LINK(app.programId._id.toString())}
                component={LinkDom}
                target="_blank"
              >
                {app.programId.school} {app.programId.program_name}{' '}
                {app.programId.degree} {app.programId.semester} -{' '}
                <strong>{app.programId.lang}</strong>
              </Link>
            </ListItem>
          ))}
        </Card>
      )}
    </>
  );
}
