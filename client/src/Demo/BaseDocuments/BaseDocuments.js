import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as LinkDom } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  CircularProgress,
  Breadcrumbs,
  Card,
  Link,
  Typography
} from '@mui/material';

// import StudentBaseDocumentsStatus from './StudentBaseDocumentsStatus';
import BaseDocument_StudentView from './BaseDocument_StudentView';
import {
  SYMBOL_EXPLANATION,
  profile_list,
  FILE_NOT_OK_SYMBOL,
  FILE_UPLOADED_SYMBOL,
  FILE_DONT_CARE_SYMBOL,
  FILE_MISSING_SYMBOL
} from '../Utils/contants';
import ModalMain from '../Utils/ModalHandler/ModalMain';
import ErrorPage from '../Utils/ErrorPage';
import { is_TaiGer_role, DocumentStatus } from '../Utils/checking-functions';

import { getStudentsAndDocLinks, updateProfileDocumentStatus } from '../../api';
import { TabTitle } from '../Utils/TabTitle';
import { useAuth } from '../../components/AuthProvider';
import DEMO from '../../store/constant';
import { appConfig } from '../../config';
import Loading from '../../components/Loading/Loading';
import { MuiDataGrid } from '../../components/MuiDataGrid';
import { IoCheckmarkCircle } from 'react-icons/io5';
import AcceptProfileFileModel from './AcceptedFilePreviewModal';
import ModalNew from '../../components/Modal';

function BaseDocuments() {
  const { user } = useAuth();
  const [studentBaseDocumentsStatusState, setStudentBaseDocumentsStatusState] =
    useState({ showPreview: false, preview_path: '#', isLoaded: true });
  const { t } = useTranslation();
  const [baseDocumentsState, setBaseDocumentsState] = useState({
    error: '',
    isLoaded: false,
    data: null,
    base_docs_link: null,
    success: false,
    students: null,
    showPreview: false,
    preview_path: '#',
    rejectProfileFileModel: false,
    acceptProfileFileModel: false,
    file: '',
    student_id: '',
    status: '', //reject, accept... etc
    category: '',
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

  const showPreview = (e, path, doc_key, category, student_id) => {
    e.preventDefault();
    setStudentBaseDocumentsStatusState((prevState) => ({
      ...prevState,
      showPreview: true,
      preview_path: path,
      doc_key: doc_key,
      category,
      student_id
    }));
  };

  const closeRejectWarningWindow = () => {
    setStudentBaseDocumentsStatusState((prevState) => ({
      ...prevState,
      rejectProfileFileModel: false
    }));
  };
  const handleRejectMessage = (e, rejectmessage) => {
    e.preventDefault();
    setStudentBaseDocumentsStatusState((prevState) => ({
      ...prevState,
      feedback: rejectmessage
    }));
  };
  const onUpdateProfileFilefromstudent = (e) => {
    e.preventDefault();
    setStudentBaseDocumentsStatusState((prevState) => ({
      ...prevState,
      isLoaded: false
    }));
    updateProfileDocumentStatus(
      baseDocumentsState.category,
      baseDocumentsState.student_id,
      baseDocumentsState.status,
      baseDocumentsState.feedback
    ).then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        if (success) {
          const students_temp = [...baseDocumentsState.students];
          const student_index = students_temp.findIndex(
            (student) => student._id === baseDocumentsState.student_id
          );
          students_temp[student_index] = data;
          setBaseDocumentsState((prevState) => ({
            ...prevState,
            students: students_temp,
            success,
            acceptProfileFileModel: false,
            rejectProfileFileModel: false,
            isLoaded: true,
            res_modal_status: status
          }));
          setStudentBaseDocumentsStatusState((prevState) => ({
            ...prevState,
            showPreview: false,
            isLoaded: true
          }));
        } else {
          // TODO: redesign, modal ist better!
          const { message } = resp.data;
          setBaseDocumentsState((prevState) => ({
            ...prevState,
            showPreview: false,
            acceptProfileFileModel: false,
            rejectProfileFileModel: false,
            res_modal_message: message,
            res_modal_status: status
          }));
          setStudentBaseDocumentsStatusState((prevState) => ({
            ...prevState,
            showPreview: false,
            isLoaded: true
          }));
        }
      },
      (error) => {
        setBaseDocumentsState((prevState) => ({
          ...prevState,
          isLoaded: {
            ...prevState.isLoaded,
            [studentBaseDocumentsStatusState.category]: true
          },
          error,
          showPreview: false,
          rejectProfileFileModel: false,
          res_modal_status: 500,
          res_modal_message: ''
        }));
      }
    );
  };

  const ConfirmError = () => {
    setBaseDocumentsState((prevState) => ({
      ...prevState,
      res_modal_status: 0,
      res_modal_message: ''
    }));
  };

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

  const profileArray = Object.entries(profile_list).map(([key, value]) => [
    key,
    value
  ]);

  const baseDocumentColumnsWithoutName = profileArray.map((basdDoc) => {
    return {
      field: basdDoc[0],
      headerName: basdDoc[1],
      minWidth: 100,
      renderCell: (params) => {
        if (params.value?.status === DocumentStatus.Uploaded) {
          return (
            <Link
              underline="hover"
              to={''}
              component={LinkDom}
              target="_blank"
              title={params.value?.status}
            >
              {FILE_UPLOADED_SYMBOL}
              {`${params.value?.status || ''}`}
            </Link>
          );
        } else if (params.value?.status === DocumentStatus.Accepted) {
          let document_split = params.value?.path.replace(/\\/g, '/');
          let document_name = document_split.split('/')[1];
          return (
            <Box
              onClick={(e) => {
                showPreview(
                  e,
                  document_name,
                  params.value?.name,
                  document_name,
                  params.row.id
                );
              }}
              style={{ textDecoration: 'none', cursor: 'pointer' }}
            >
              <IoCheckmarkCircle
                size={24}
                color="limegreen"
                title="Valid Document"
              />{' '}
              {`${params.value?.status || ''}`}
            </Box>
          );
        } else if (params.value?.status === DocumentStatus.Rejected) {
          return (
            <>
              {FILE_NOT_OK_SYMBOL} {`${params.value?.status || ''}`}
            </>
          );
        } else if (params.value?.status === DocumentStatus.NotNeeded) {
          return (
            <>
              {FILE_DONT_CARE_SYMBOL}
              {`${params.value?.status || ''}`}
            </>
          );
        } else {
          return <>{FILE_MISSING_SYMBOL}</>;
        }
      }
    };
  });

  const baseDocumentColumns = [
    {
      field: 'studentName',
      headerName: 'First / Last Name',
      minWidth: 100,
      renderCell: (params) => {
        const linkUrl = `${DEMO.STUDENT_DATABASE_STUDENTID_LINK(
          params.row.id,
          DEMO.PROFILE_HASH
        )}`;
        return (
          <>
            <Link
              underline="hover"
              to={linkUrl}
              component={LinkDom}
              target="_blank"
              title={params.value}
            >
              {params.value}
            </Link>
          </>
        );
      }
    },
    {
      field: 'agents',
      headerName: 'Agents',
      minWidth: 100,
      renderCell: (params) => {
        return params.value?.map((agent) => (
          <Link
            underline="hover"
            to={DEMO.TEAM_AGENT_LINK(agent._id.toString())}
            component={LinkDom}
            target="_blank"
            title={agent.firstname}
            key={`${agent._id.toString()}`}
          >
            {`${agent.firstname} `}
          </Link>
        ));
      }
    },
    ...baseDocumentColumnsWithoutName
  ];

  const baseDocumentTransformed = (students) => {
    return students.map((student) => ({
      id: student._id.toString(),
      studentName: `${student?.lastname_chinese || ''}${
        student?.firstname_chinese || ''
      } ${student.firstname} ${student.lastname}`,
      agents: student.agents,
      ...student.profile.reduce((acc, curr) => {
        acc[curr.name] = curr;
        return acc;
      }, {})
    }));
  };
  const student_profile_transformed = baseDocumentTransformed(
    baseDocumentsState.students
  );
  console.log(student_profile_transformed);
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
    if (status === 'accepted') {
      setBaseDocumentsState((prevState) => ({
        ...prevState,
        student_id,
        category,
        status,
        acceptProfileFileModel: true
      }));
    } else {
      setBaseDocumentsState((prevState) => ({
        ...prevState,
        student_id,
        category,
        status,
        rejectProfileFileModel: true
      }));
    }
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
        <MuiDataGrid
          columns={baseDocumentColumns}
          rows={student_profile_transformed}
        />
      ) : (
        <>{student_profile_student_view}</>
      )}
      {res_modal_status >= 400 && (
        <ModalMain
          ConfirmError={ConfirmError}
          res_modal_status={res_modal_status}
          res_modal_message={res_modal_message}
        />
      )}
      <AcceptProfileFileModel
        showPreview={studentBaseDocumentsStatusState.showPreview}
        closePreviewWindow={closePreviewWindow}
        path={studentBaseDocumentsStatusState.preview_path}
        preview_path={studentBaseDocumentsStatusState.preview_path}
        student_id={studentBaseDocumentsStatusState.student_id}
        isLoaded={studentBaseDocumentsStatusState.isLoaded}
        k={studentBaseDocumentsStatusState.doc_key}
        onUpdateProfileDocStatus={onUpdateProfileDocStatus}
      />
      <ModalNew
        open={baseDocumentsState.rejectProfileFileModel}
        onClose={closeRejectWarningWindow}
        aria-labelledby="contained-modal-title-vcenter"
      >
        <Typography variant="h6">Warning</Typography>
        <Typography variant="body1">
          Please give a reason why the uploaded {baseDocumentsState.category} is
          invalied?
        </Typography>
        <TextField
          type="text"
          placeholder="ex. Poor scanned quality."
          onChange={(e) => handleRejectMessage(e, e.target.value)}
        />
        <Box>
          <Button
            disabled={baseDocumentsState.feedback === ''}
            onClick={(e) => onUpdateProfileFilefromstudent(e)}
          >
            {!baseDocumentsState.isLoaded ? (
              <CircularProgress size={24} />
            ) : (
              t('Yes', { ns: 'common' })
            )}
          </Button>
          <Button onClick={closeRejectWarningWindow}>
            {t('No', { ns: 'common' })}
          </Button>
        </Box>
      </ModalNew>
    </Box>
  );
}

export default BaseDocuments;
