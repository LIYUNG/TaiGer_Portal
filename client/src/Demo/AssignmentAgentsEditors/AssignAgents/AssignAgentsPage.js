import React from 'react';
import {
    Box,
    Breadcrumbs,
    Card,
    Link,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from '@mui/material';
import { Link as LinkDom } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { appConfig } from '../../../config';
import DEMO from '../../../store/constant';
import NoAgentsStudentsCard from '../../Dashboard/MainViewTab/NoAgentsStudentsCard/NoAgentsStudentsCard';

const AssignAgentsPage = (props) => {
    const { t } = useTranslation();
    const no_agent_students = props.students.map((student, i) => (
        <NoAgentsStudentsCard
            key={i}
            student={student}
            submitUpdateAgentlist={props.submitUpdateAgentlist}
        />
    ));

    return (
        <Box>
            <Breadcrumbs aria-label="breadcrumb">
                <Link
                    color="inherit"
                    component={LinkDom}
                    to={`${DEMO.DASHBOARD_LINK}`}
                    underline="hover"
                >
                    {appConfig.companyName}
                </Link>
                <Typography color="text.primary">
                    {t('Assign Agents')}
                </Typography>
            </Breadcrumbs>
            <Card sx={{ p: 2 }}>
                <Typography variant="h6">
                    {t('No Agents Students', { ns: 'dashboard' })}
                </Typography>
                <TableContainer style={{ overflowX: 'auto' }}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell />
                                <TableCell>
                                    {t('First-, Last Name', { ns: 'common' })}
                                </TableCell>
                                <TableCell>
                                    {t('Email', { ns: 'common' })}
                                </TableCell>
                                <TableCell>
                                    {t('Target Year', { ns: 'common' })}
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>{no_agent_students}</TableBody>
                    </Table>
                </TableContainer>
            </Card>
        </Box>
    );
}

export default AssignAgentsPage;
