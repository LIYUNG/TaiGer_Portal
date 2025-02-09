import React from 'react';
import { Link as LinkDom } from 'react-router-dom';
import { Alert, Card, Link, ListItem } from '@mui/material';
import i18next from 'i18next';

import {
    isLanguageNotMatchedInAnyProgram,
    languageNotMatchedPrograms
} from '../../Demo/Utils/checking-functions';
import DEMO from '../../store/constant';

const ProgramLanguageNotMatchedBanner = ({ student }) => {
    return isLanguageNotMatchedInAnyProgram(student) ? (
        <Card sx={{ border: '4px solid red' }}>
            <Alert severity="warning">
                {i18next.t(
                    'Programs below require the language that does not match to your background if your survey.',
                    {
                        ns: 'common'
                    }
                )}
                &nbsp;:&nbsp;
            </Alert>
            {languageNotMatchedPrograms(student)?.map((app) => (
                <ListItem key={app.programId._id.toString()}>
                    <Link
                        component={LinkDom}
                        target="_blank"
                        to={DEMO.SINGLE_PROGRAM_LINK(
                            app.programId._id.toString()
                        )}
                    >
                        {app.programId.school} {app.programId.program_name}{' '}
                        {app.programId.degree} {app.programId.semester} -{' '}
                        <strong>{app.programId.lang}</strong>
                    </Link>
                </ListItem>
            ))}
        </Card>
    ) : null;
};
export default ProgramLanguageNotMatchedBanner;
