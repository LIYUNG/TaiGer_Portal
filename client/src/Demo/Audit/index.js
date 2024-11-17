import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody
} from '@mui/material';
import { useTranslation } from 'react-i18next';

import ErrorPage from '../Utils/ErrorPage';
import { TabTitle } from '../Utils/TabTitle';
import { useAuth } from '../../components/AuthProvider';
import { convertDate } from '../Utils/contants';

function Audit({ audit }) {
  const { t } = useTranslation();
  const { user } = useAuth();

  const [auditState, setAuditState] = useState({
    error: '',
    isLoaded: false,
    data: null,
    user: {},
    changed_personaldata: false,
    personaldata: {
      firstname: user.firstname,
      firstname_chinese: user.firstname_chinese,
      lastname: user.lastname,
      lastname_chinese: user.lastname_chinese,
      birthday: user.birthday
    },
    credentials: {
      current_password: '',
      new_password: '',
      new_password_again: ''
    },
    updatecredentialconfirmed: false,
    res_status: 0,
    res_modal_message: '',
    res_modal_status: 0
  });

  useEffect(() => {
    setAuditState({
      ...auditState,
      isLoaded: true
    });
  }, []);

  const { res_status, isLoaded } = auditState;
  TabTitle('Audit');
  if (!isLoaded) {
    return <CircularProgress />;
  }

  if (res_status >= 400) {
    return <ErrorPage res_status={res_status} />;
  }

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

                return (
                  <TableRow key={record._id}>
                    <TableCell>{`${record?.performedBy?.firstname} ${record?.performedBy?.lastname}`}</TableCell>
                    <TableCell>{record.action}</TableCell>
                    <TableCell>{record.field}</TableCell>
                    <TableCell>
                      {addedUsers && `+ ${addedUsers}`}
                      {removedUsers && ` - ${removedUsers}`}
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
