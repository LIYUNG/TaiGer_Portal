import React from 'react';
import { Card, Typography, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { isProgramDecided } from '@taiger-common/core';

import { check_student_needs_uni_assist } from '../Utils/checking-functions';
import { UniAssistProgramBlock } from './UniAssistProgramBlock';

const UniAssistListCard = (props) => {
    const { t } = useTranslation();

    const app_name = props.student.applications
        .filter((application) => isProgramDecided(application))
        .map((application, i) => (
            <Box key={i} sx={{ mb: 2 }}>
                <UniAssistProgramBlock
                    application={application}
                    student={props.student}
                />
            </Box>
        ));

    return check_student_needs_uni_assist(props.student) ? (
        <Card sx={{ padding: 2 }}>
            <Typography>
                {t(
                    'The following program needs uni-assist process, please check if paid, uploaded document and upload VPD here'
                )}
                :{app_name}
            </Typography>
        </Card>
    ) : (
        <Card sx={{ padding: 2 }}>
            <Typography>
                {t('Based on the applications, Uni-Assist is NOT needed')}
            </Typography>
        </Card>
    );
};
export default UniAssistListCard;
