import React from 'react';
import { useTranslation } from 'react-i18next';
import {
    Box,
    Card,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Alert,
    TableContainer,
    Typography
} from '@mui/material';

import BaseDocumentCheckingTasks from '../../MainViewTab/AgentTasks/BaseDocumentCheckingTasks';
import { useAuth } from '../../../../components/AuthProvider';

const BaseDocumentCheckingTable = (props) => {
    const { user } = useAuth();
    const { t } = useTranslation();

    const base_documents_checking_tasks = props.students
        .filter((student) =>
            student.agents.some((agent) => agent._id === user._id.toString())
        )
        .map((student, i) => (
            <BaseDocumentCheckingTasks key={i} student={student} />
        ));

    return (
        <Box>
            <Card sx={{ mb: 2 }}>
                <Alert severity="error">
                    <Typography>
                        {t('Check uploaded base documents')}:
                    </Typography>
                </Alert>
                <TableContainer style={{ overflowX: 'auto' }}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    {t('Student', { ns: 'common' })}
                                </TableCell>
                                <TableCell>
                                    {t('Document Type', { ns: 'common' })}
                                </TableCell>
                                <TableCell>
                                    {t('Upload Time', { ns: 'common' })}
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>{base_documents_checking_tasks}</TableBody>
                    </Table>
                </TableContainer>
            </Card>
        </Box>
    );
};

export default BaseDocumentCheckingTable;
