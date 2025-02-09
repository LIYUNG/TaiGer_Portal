import React from 'react';
import { Link as LinkDom } from 'react-router-dom';
import {
    Box,
    Typography,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Link
} from '@mui/material';
import { useTranslation } from 'react-i18next';

import { convertDate } from '../../utils/contants';
import DEMO from '../../store/constant';

const Audit = ({ audit }) => {
    const { t } = useTranslation();

    return (
        <Box>
            <Box sx={{ mx: 2 }}>
                <Typography variant="h6">{t('Audit')}</Typography>
                <TableContainer style={{ overflowX: 'auto' }}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    {t('Actor', { ns: 'common' })}
                                </TableCell>
                                <TableCell>
                                    {t('Action', { ns: 'common' })}
                                </TableCell>
                                <TableCell>
                                    {t('Field', { ns: 'common' })}
                                </TableCell>
                                <TableCell>
                                    {t('Changes', { ns: 'common' })}
                                </TableCell>
                                <TableCell>
                                    {t('Resources', { ns: 'common' })}
                                </TableCell>
                                <TableCell>
                                    {t('Time', { ns: 'common' })}
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {audit?.map((record) => {
                                const isNewUser = record?.changes?.after
                                    ?.newUser
                                    ? true
                                    : false;
                                const newUser = `${record?.changes?.after?.newUser?.firstname}${record?.changes?.after?.newUser?.lastname}`;
                                const isStatusChanged =
                                    record?.field === 'status';
                                const isAssign = [
                                    'agents',
                                    'editors',
                                    'interview trainer',
                                    'essay writer'
                                ].includes(record?.field);
                                const addedUsers = record?.changes?.after?.added
                                    ?.map(
                                        (user) =>
                                            `${user.firstname} ${user.lastname}`
                                    )
                                    .join(', ');
                                const removedUsers =
                                    record?.changes?.after?.removed
                                        ?.map(
                                            (user) =>
                                                `${user.firstname} ${user.lastname}`
                                        )
                                        .join(', ');
                                const program_name = record
                                    ?.targetDocumentThreadId?.program_id
                                    ? ` - ${record?.targetDocumentThreadId?.program_id?.school}
                          ${record?.targetDocumentThreadId?.program_id?.program_name}
                          ${record?.targetDocumentThreadId?.program_id?.degree}
                          ${record?.targetDocumentThreadId?.program_id?.semester}
                          `
                                    : record?.interviewThreadId?.program_id
                                      ? ` - ${record?.interviewThreadId?.program_id?.school}
                          ${record?.interviewThreadId?.program_id?.program_name}
                          ${record?.interviewThreadId?.program_id?.degree}
                          ${record?.interviewThreadId?.program_id?.semester}
                          `
                                      : '';
                                const fileName =
                                    record?.targetDocumentThreadId &&
                                    `${record?.targetDocumentThreadId?.file_type}${program_name}
                          `;
                                const interview_name =
                                    record?.interviewThreadId &&
                                    `Interview${program_name}
                          `;
                                return (
                                    <TableRow key={record._id}>
                                        <TableCell>{`${record?.performedBy?.firstname} ${record?.performedBy?.lastname}`}</TableCell>
                                        <TableCell>{record.action}</TableCell>
                                        <TableCell>{record.field}</TableCell>
                                        <TableCell>
                                            {isNewUser ? newUser : ''}
                                            {isStatusChanged
                                                ? record?.changes?.after
                                                    ? 'Closed'
                                                    : 'Open'
                                                : ''}
                                            {isAssign
                                                ? `${addedUsers ? `+ ${addedUsers}` : ''} ${
                                                      removedUsers &&
                                                      ` - ${removedUsers}`
                                                  }`
                                                : ''}
                                        </TableCell>
                                        <TableCell>
                                            {record?.targetDocumentThreadId ? (
                                                <Link
                                                    component={LinkDom}
                                                    target="_blank"
                                                    to={DEMO.DOCUMENT_MODIFICATION_LINK(
                                                        record?.targetDocumentThreadId._id?.toString()
                                                    )}
                                                >
                                                    {fileName}
                                                </Link>
                                            ) : null}
                                            {record?.interviewThreadId ? (
                                                <Link
                                                    component={LinkDom}
                                                    target="_blank"
                                                    to={DEMO.INTERVIEW_SINGLE_LINK(
                                                        record?.interviewThreadId._id?.toString()
                                                    )}
                                                >
                                                    {interview_name}
                                                </Link>
                                            ) : null}
                                        </TableCell>
                                        <TableCell>
                                            {convertDate(record.createdAt)}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Box>
    );
};

export default Audit;
