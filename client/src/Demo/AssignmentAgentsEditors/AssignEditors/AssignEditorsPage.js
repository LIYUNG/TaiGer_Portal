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

import NoEditorsStudentsCard from '../../Dashboard/MainViewTab/NoEditorsStudentsCard/NoEditorsStudentsCard';
import { appConfig } from '../../../config';
import DEMO from '../../../store/constant';
import { BreadcrumbsNavigation } from '../../../components/BreadcrumbsNavigation/BreadcrumbsNavigation';

const NoEditorsTableHeader = () => {
    const { t } = useTranslation();
    return (
        <TableHead>
            <TableRow>
                <TableCell />
                <TableCell>
                    {t('First-, Last Name', { ns: 'common' })}
                </TableCell>
                <TableCell>{t('Email', { ns: 'common' })}</TableCell>
                <TableCell>{t('Status', { ns: 'common' })}</TableCell>
                <TableCell>{t('Target Program Language')}</TableCell>
                <TableCell>{t('Target Year', { ns: 'common' })}</TableCell>
                <TableCell>{t('Agents', { ns: 'common' })}</TableCell>
            </TableRow>
        </TableHead>
    );
};

const AssignEditorsPage = ({ students, submitUpdateEditorlist }) => {
    const { t } = useTranslation();
    const no_editor_students = students.map((student, i) => (
        <NoEditorsStudentsCard
            key={i}
            student={student}
            submitUpdateEditorlist={submitUpdateEditorlist}
        />
    ));

    return (
        <Box>
            <BreadcrumbsNavigation
                items={[
                    { label: appConfig.companyName, link: DEMO.DASHBOARD_LINK },
                    { label: t('Assign Editors') }
                ]}
            />
            <Card sx={{ p: 2 }}>
                <Typography variant="h6">{t('No Editors Students')}</Typography>
                <TableContainer style={{ overflowX: 'auto' }}>
                    <Table size="small">
                        <NoEditorsTableHeader />
                        <TableBody>{no_editor_students}</TableBody>
                    </Table>
                </TableContainer>
            </Card>
        </Box>
    );
};

export default AssignEditorsPage;
