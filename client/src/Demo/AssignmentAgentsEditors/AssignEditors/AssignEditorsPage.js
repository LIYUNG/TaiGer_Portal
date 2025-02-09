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

import NoEditorsStudentsCard from '../../Dashboard/MainViewTab/NoEditorsStudentsCard/NoEditorsStudentsCard';
import { appConfig } from '../../../config';
import DEMO from '../../../store/constant';

const AssignEditorsPage = (props) => {
    const { t } = useTranslation();
    const no_editor_students = props.students.map((student, i) => (
        <NoEditorsStudentsCard
            key={i}
            student={student}
            submitUpdateEditorlist={props.submitUpdateEditorlist}
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
                <Typography color="text.primary">Assign Editors</Typography>
            </Breadcrumbs>
            <Card sx={{ p: 2 }}>
                <Typography variant="h6">{t('No Editors Students')}</Typography>
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
                                    {t('Status', { ns: 'common' })}
                                </TableCell>
                                <TableCell>
                                    {t('Target Program Language')}
                                </TableCell>
                                <TableCell>
                                    {t('Target Year', { ns: 'common' })}
                                </TableCell>
                                <TableCell>
                                    {t('Agents', { ns: 'common' })}
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>{no_editor_students}</TableBody>
                    </Table>
                </TableContainer>
            </Card>
        </Box>
    );
};

export default AssignEditorsPage;
