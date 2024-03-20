import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as LinkDom } from 'react-router-dom';
import {
  Box,
  Button,
  CircularProgress,
  Breadcrumbs,
  Card,
  Link,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import CloseIcon from '@mui/icons-material/Close';

import StudentBaseDocumentsStatus from './StudentBaseDocumentsStatus';
import BaseDocument_StudentView from './BaseDocument_StudentView';
import {
  SYMBOL_EXPLANATION,
  split_header,
  profile_list
} from '../Utils/contants';
import ModalMain from '../Utils/ModalHandler/ModalMain';
import ErrorPage from '../Utils/ErrorPage';
import {
  is_TaiGer_role,
  is_TaiGer_Editor,
  is_TaiGer_Student
} from '../Utils/checking-functions';
import ModalNew from '../../components/Modal';
import FilePreview from '../../components/FilePreview/FilePreview';
import { BASE_URL } from '../../api/request';

import { getStudentsAndDocLinks } from '../../api';
import { TabTitle } from '../Utils/TabTitle';
import { useAuth } from '../../components/AuthProvider';
import DEMO from '../../store/constant';
import { appConfig } from '../../config';
import Loading from '../../components/Loading/Loading';

function BaseDocuments() {
  const { user } = useAuth();
  const {
    studentBaseDocumentsStatusState,
    setStudentBaseDocumentsStatusState
  } = useState({ showPreview: false, preview_path: '#', isLoaded: true });
  const { t } = useTranslation();
  const [baseDocumentsState, setBaseDocumentsState] = useState({
    error: '',
    isLoaded: false,
    data: null,
    base_docs_link: null,
    success: false,
    students: null,
    file: '',
    student_id: '',
    status: '', //reject, accept... etc
    category: '',
    feedback: '',
    expand: false,
    res_status: 0,
    res_modal_status: 0,
    res_modal_message: ''
  });

  useEffect(() => {
    getStudentsAndDocLinks().then(
      (resp) => {
        const { base_docs_link, data, success } = resp.data;
        const { status } = resp;
        if (success) {
          setBaseDocumentsState((prevState) => ({
            ...prevState,
            isLoaded: true,
            students: data,
            base_docs_link,
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

  const {
    res_status,
    base_docs_link,
    isLoaded,
    res_modal_status,
    res_modal_message
  } = baseDocumentsState;

  TabTitle('Base Documents');

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

  const student_profile_student_view = baseDocumentsState.students.map(
    (student, i) => (
      <Card key={i}>
        <BaseDocument_StudentView
          base_docs_link={base_docs_link}
          student={student}
          SYMBOL_EXPLANATION={SYMBOL_EXPLANATION}
        />
      </Card>
    )
  );

  const closePreviewWindow = () => {
    setStudentBaseDocumentsStatusState((prevState) => ({
      ...prevState,
      showPreview: false
    }));
  };

  const onUpdateProfileDocStatus = (e, category, student_id, status) => {
    e.preventDefault();
    console.log(category);
    console.log(student_id);
    console.log(status);
    // if (status === 'accepted') {
    //   setButtonSetAcceptedState((prevState) => ({
    //     ...prevState,
    //     student_id,
    //     category,
    //     status,
    //     acceptProfileFileModel: true
    //   }));
    // } else {
    //   setButtonSetAcceptedState((prevState) => ({
    //     ...prevState,
    //     student_id,
    //     category,
    //     status,
    //     rejectProfileFileModel: true
    //   }));
    // }
  };

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
        <Typography color="text.primary">{t('Base Documents')}</Typography>
      </Breadcrumbs>
      {is_TaiGer_role(user) ? (
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
      ) : (
        <>{student_profile_student_view}</>
      )}
      {res_modal_status >= 400 && (
        <ModalMain
          ConfirmError={this.ConfirmError}
          res_modal_status={res_modal_status}
          res_modal_message={res_modal_message}
        />
      )}
      <ModalNew
        open={studentBaseDocumentsStatusState?.showPreview || false}
        onClose={closePreviewWindow}
        aria-labelledby="contained-modal-title-vcenter2"
      >
        <Typography id="contained-d-title-vcenter">{'props.path'}</Typography>
        <FilePreview
          path={studentBaseDocumentsStatusState?.preview_path}
          student_id={studentBaseDocumentsStatusState?.student_id.toString()}
        />
        {'abc.pdf'.split('.')[1] !== 'pdf' && (
          <a
            href={`${BASE_URL}/api/students/${studentBaseDocumentsStatusState?.student_id.toString()}/files/${'props.path'}`}
            download
            target="_blank"
            rel="noreferrer"
          >
            <Button
              size="small"
              color="primary"
              variant="contained"
              title="Download"
              startIcon={<FileDownloadIcon />}
            >
              {t('Download')}
            </Button>
          </a>
        )}
        {!(is_TaiGer_Editor(user) || is_TaiGer_Student(user)) && (
          <Button
            variant="contained"
            color="secondary"
            size="small"
            disabled={!studentBaseDocumentsStatusState?.isLoaded}
            onClick={(e) =>
              onUpdateProfileDocStatus(
                e,
                'props.k',
                studentBaseDocumentsStatusState?.student_id,
                'rejected'
              )
            }
            startIcon={<CloseIcon />}
            sx={{ mr: 2 }}
          >
            {t('Reject')}
          </Button>
        )}
        <Button size="small" variant="outlined" onClick={closePreviewWindow}>
          {!studentBaseDocumentsStatusState?.isLoaded ? (
            <CircularProgress />
          ) : (
            t('Close', { ns: 'common' })
          )}
        </Button>
      </ModalNew>
    </Box>
  );
}

export default BaseDocuments;
