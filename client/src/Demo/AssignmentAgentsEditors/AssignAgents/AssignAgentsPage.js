import React from 'react';
import {
    Box,
    Card,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from '@mui/material';
import { useTranslation } from 'react-i18next';

import { appConfig } from '../../../config';
import DEMO from '../../../store/constant';
import NoAgentsStudentsCard from '../../Dashboard/MainViewTab/NoAgentsStudentsCard/NoAgentsStudentsCard';
import { BreadcrumbsNavigation } from '../../../components/BreadcrumbsNavigation/BreadcrumbsNavigation';

const NoAgentsTable = ({ students, submitUpdateAgentlist }) => {
    const { t } = useTranslation();
    return (
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
                    <TableBody>
                        {students.map((student, i) => (
                            <NoAgentsStudentsCard
                                key={i}
                                student={student}
                                submitUpdateAgentlist={submitUpdateAgentlist}
                            />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Card>
    );
};

const AssignAgentsPage = ({ students, submitUpdateAgentlist }) => {
    const { t } = useTranslation();

    return (
        <Box>
            <BreadcrumbsNavigation
                items={[
                    { label: appConfig.companyName, link: DEMO.DASHBOARD_LINK },
                    { label: t('Assign Agents') }
                ]}
            />
            <NoAgentsTable
                students={students}
                submitUpdateAgentlist={submitUpdateAgentlist}
            />
        </Box>
    );
};

export default AssignAgentsPage;
