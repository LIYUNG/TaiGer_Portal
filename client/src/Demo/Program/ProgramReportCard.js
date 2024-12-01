import React, { useEffect, useState } from 'react';
import {
  Alert,
  Card,
  Link,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import { Link as LinkDom } from 'react-router-dom';

import { getProgramTickets } from '../../api';
import ErrorPage from '../Utils/ErrorPage';
import DEMO from '../../store/constant';
import Loading from '../../components/Loading/Loading';
import { useTranslation } from 'react-i18next';

function ProgramReportCard() {
  const { t } = useTranslation();
  const [programReportCardState, setProgramReportCardState] = useState({
    isReport: false,
    isReportDelete: false,
    isUpdateReport: false,
    description: '',
    isLoaded: false,
    tickets: [],
    ticket: {},
    res_status: 0,
    res_modal_message: '',
    res_modal_status: 0
  });

  useEffect(() => {
    getProgramTickets('program', 'open').then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        if (success) {
          setProgramReportCardState((prevState) => ({
            ...prevState,
            isLoaded: true,
            tickets: data,
            success: success,
            res_status: status
          }));
        } else {
          setProgramReportCardState((prevState) => ({
            ...prevState,
            isLoaded: true,
            res_status: status
          }));
        }
      },
      (error) => {
        setProgramReportCardState((prevState) => ({
          ...prevState,
          isLoaded: true,
          error,
          res_status: 500
        }));
      }
    );
  }, []);

  const { res_status, isLoaded } = programReportCardState;
  if (res_status >= 400) {
    return <ErrorPage res_status={res_status} />;
  }
  if (!isLoaded) {
    return <Loading />;
  }
  if (
    !programReportCardState.tickets ||
    programReportCardState.tickets?.length === 0
  ) {
    return <></>;
  }

  const tickets = programReportCardState.tickets.map((ticket, i) => (
    <TableRow key={i}>
      <TableCell>
        <Link
          to={`${DEMO.SINGLE_PROGRAM_LINK(ticket.program_id?._id.toString())}`}
          component={LinkDom}
        >
          {i + 1}.
        </Link>
      </TableCell>
      <TableCell>
        <Link
          to={`${DEMO.SINGLE_PROGRAM_LINK(ticket.program_id?._id.toString())}`}
          component={LinkDom}
          title={`${ticket.program_id?.school} - ${ticket.program_id?.program_name}`}
        >
          {`${ticket.program_id?.school} - ${ticket.program_id?.program_name}`.substring(
            0,
            30
          )}
          {`...`}
        </Link>
      </TableCell>
      <TableCell>
        <Link
          to={`${DEMO.SINGLE_PROGRAM_LINK(ticket.program_id?._id.toString())}`}
          component={LinkDom}
          title={ticket.description}
        >
          {`${ticket.description}`.substring(0, 50)}
          {ticket.description?.length > 50 ? ` ...` : ''}
        </Link>
      </TableCell>
    </TableRow>
  ));
  return (
    <Card style={{ height: '40vh', overflow: 'auto' }}>
      <Alert severity="error">
        <Typography>
          {t('Program Update Request', { ns: 'common' })}:
        </Typography>
      </Alert>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>idx</TableCell>
            <TableCell>program</TableCell>
            <TableCell>description</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>{tickets}</TableBody>
      </Table>
    </Card>
  );
}
export default ProgramReportCard;
