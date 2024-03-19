import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as LinkDom, Navigate } from 'react-router-dom';
import {
  Box,
  Breadcrumbs,
  Link,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from '@mui/material';

import StudentBaseDocumentsStatus from './StudentBaseDocumentsStatus';
import {
  SYMBOL_EXPLANATION,
  split_header,
  profile_list
} from '../Utils/contants';
import ModalMain from '../Utils/ModalHandler/ModalMain';
import ErrorPage from '../Utils/ErrorPage';
import { is_TaiGer_role } from '../Utils/checking-functions';

import { getAllActiveStudents } from '../../api';
import { TabTitle } from '../Utils/TabTitle';
import { useAuth } from '../../components/AuthProvider';
import DEMO from '../../store/constant';
import { appConfig } from '../../config';
import Loading from '../../components/Loading/Loading';

function AllBaseDocuments() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [baseDocumentsState, setBaseDocumentsState] = useState({
    error: '',
    isLoaded: false,
    data: null,
    success: false,
    students: null,
    file: '',
    status: '', //reject, accept... etc
    expand: false,
    res_status: 0,
    res_modal_status: 0,
    res_modal_message: ''
  });

  useEffect(() => {
    getAllActiveStudents().then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        if (success) {
          setBaseDocumentsState((prevState) => ({
            ...prevState,
            isLoaded: true,
            students: data,
            success: success,
            res_status: status
          }));
        } else {
          setBaseDocumentsState((prevState) => ({
            ...prevState,
            isLoaded: true,
            res_status: status
          }));
        }
      },
      (error) => {
        setBaseDocumentsState((prevState) => ({
          ...prevState,
          isLoaded: true,
          error,
          res_status: 500
        }));
      }
    );
  }, []);

  if (!is_TaiGer_role(user)) {
    return <Navigate to={`${DEMO.DASHBOARD_LINK}`} />;
  }
  const { res_status, isLoaded, res_modal_status, res_modal_message } =
    baseDocumentsState;

  TabTitle(t('All Documents', { ns: 'common' }));

  if (!isLoaded && !baseDocumentsState.students) {
    return <Loading />;
  }

  if (res_status >= 400) {
    return <ErrorPage res_status={res_status} />;
  }

  let profile_list_keys = Object.values(profile_list);

  const student_profile = baseDocumentsState.students.map((student, i) => (
    <TableRow key={i}>
      <StudentBaseDocumentsStatus
        key={i}
        idx={i}
        student={student}
        SYMBOL_EXPLANATION={SYMBOL_EXPLANATION}
        isLoaded={isLoaded}
      />
    </TableRow>
  ));

  return (
    <Box>
      <Breadcrumbs aria-label="breadcrumb">
        <Link
          underline="hover"
          color="inherit"
          component={LinkDom}
          to={`${DEMO.DASHBOARD_LINK}`}
        >
          {appConfig.companyName}
        </Link>
        <Typography color="text.primary">
          {t('All Students', { ns: 'common' })}
        </Typography>
        <Typography color="text.primary">
          {t('All Documents', { ns: 'common' })}
        </Typography>
      </Breadcrumbs>
      {is_TaiGer_role(user) && (
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>
                First-, Last <br /> Name
              </TableCell>
              {profile_list_keys.map((doc_name, index) => (
                <TableCell key={index}>{split_header(doc_name)}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>{student_profile}</TableBody>
        </Table>
      )}
      {res_modal_status >= 400 && (
        <ModalMain
          ConfirmError={this.ConfirmError}
          res_modal_status={res_modal_status}
          res_modal_message={res_modal_message}
        />
      )}
    </Box>
  );
}

export default AllBaseDocuments;
