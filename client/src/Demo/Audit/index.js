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

import { convertDate } from '../Utils/contants';
import DEMO from '../../store/constant';

function Audit({ audit }) {
  const { t } = useTranslation();

  return (
    <Box>
      <Box sx={{ mx: 2 }}>
        <Typography variant="h6">{t('Audit')}</Typography>
        <TableContainer style={{ overflowX: 'auto' }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>{t('Actor', { ns: 'common' })}</TableCell>
                <TableCell>{t('Action', { ns: 'common' })}</TableCell>
                <TableCell>{t('Field', { ns: 'common' })}</TableCell>
                <TableCell>{t('Changes', { ns: 'common' })}</TableCell>
                <TableCell>{t('Resources', { ns: 'common' })}</TableCell>
                <TableCell>{t('Time', { ns: 'common' })}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {audit?.map((record) => {
                const addedUsers = record?.changes?.after?.added
                  ?.map((user) => `${user.firstname} ${user.lastname}`)
                  .join(', ');
                const removedUsers = record?.changes?.after?.removed
                  ?.map((user) => `${user.firstname} ${user.lastname}`)
                  .join(', ');
                const program_name =
                  record?.targetDocumentThreadId &&
                  `${record?.targetDocumentThreadId?.file_type} - ${record?.targetDocumentThreadId?.program_id?.school}
                          ${record?.targetDocumentThreadId?.program_id?.program_name}
                          ${record?.targetDocumentThreadId?.program_id?.degree}
                          ${record?.targetDocumentThreadId?.program_id?.semester}
                          `;
                const interview_name =
                  record?.interviewThreadId &&
                  `Interview - ${record?.interviewThreadId?.program_id?.school}
                          ${record?.interviewThreadId?.program_id?.program_name}
                          ${record?.interviewThreadId?.program_id?.degree}
                          ${record?.interviewThreadId?.program_id?.semester}
                          `;
                return (
                  <TableRow key={record._id}>
                    <TableCell>{`${record?.performedBy?.firstname} ${record?.performedBy?.lastname}`}</TableCell>
                    <TableCell>{record.action}</TableCell>
                    <TableCell>{record.field}</TableCell>
                    <TableCell>
                      {addedUsers && `+ ${addedUsers}`}
                      {removedUsers && ` - ${removedUsers}`}
                    </TableCell>
                    <TableCell>
                      {record?.targetDocumentThreadId && (
                        <Link
                          to={DEMO.DOCUMENT_MODIFICATION_LINK(
                            record?.targetDocumentThreadId._id?.toString()
                          )}
                          component={LinkDom}
                          target="_blank"
                        >
                          {program_name}
                        </Link>
                      )}
                      {record?.interviewThreadId && (
                        <Link
                          to={DEMO.INTERVIEW_SINGLE_LINK(
                            record?.interviewThreadId._id?.toString()
                          )}
                          component={LinkDom}
                          target="_blank"
                        >
                          {interview_name}
                        </Link>
                      )}
                    </TableCell>
                    <TableCell>{convertDate(record.createdAt)}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}

export default Audit;
