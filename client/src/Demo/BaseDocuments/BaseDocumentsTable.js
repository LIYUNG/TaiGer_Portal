import React, { useState } from 'react';
import { Link as LinkDom } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  CircularProgress,
  Link,
  Typography,
  IconButton
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import ModalNew from '../../components/Modal';
import { MuiDataGrid } from '../../components/MuiDataGrid';
import {
  FILE_DONT_CARE_SYMBOL,
  FILE_MISSING_SYMBOL,
  FILE_NOT_OK_SYMBOL,
  FILE_OK_SYMBOL,
  FILE_UPLOADED_SYMBOL,
  profile_list
} from '../Utils/contants';
import { DocumentStatus } from '../Utils/checking-functions';
import { updateProfileDocumentStatus } from '../../api';
import DEMO from '../../store/constant';
import AcceptProfileFileModel from './AcceptedFilePreviewModal';

export function BaseDocumentsTable(props) {
  const [baseDocumentsTableState, setBaseDocumentsTableState] = useState({
    students: props.students,
    isLoaded: true,
    rejectProfileFileModel: false,
    preview_path: '',
    doc_key: '',
    showPreview: false,
    acceptProfileFileModel: false,
    student_id: '',
    status: '', //reject, accept... etc
    category: '',
    feedback: ''
  });

  const { t } = useTranslation();

  const onUpdateProfileFilefromstudent = (e) => {
    e.preventDefault();
    setBaseDocumentsTableState((prevState) => ({
      ...prevState,
      isLoaded: false
    }));
    updateProfileDocumentStatus(
      baseDocumentsTableState.category,
      baseDocumentsTableState.student_id,
      baseDocumentsTableState.status,
      baseDocumentsTableState.feedback
    ).then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        if (success) {
          const students_temp = [...baseDocumentsTableState.students];
          const student_index = students_temp.findIndex(
            (student) => student._id === baseDocumentsTableState.student_id
          );
          students_temp[student_index] = data;
          setBaseDocumentsTableState((prevState) => ({
            ...prevState,
            students: students_temp,
            success,
            acceptProfileFileModel: false,
            rejectProfileFileModel: false,
            showPreview: false,
            isLoaded: true,
            res_modal_status: status
          }));
          setBaseDocumentsTableState((prevState) => ({
            ...prevState
          }));
        } else {
          // TODO: redesign, modal ist better!
          const { message } = resp.data;
          setBaseDocumentsTableState((prevState) => ({
            ...prevState,
            showPreview: false,
            acceptProfileFileModel: false,
            rejectProfileFileModel: false,
            isLoaded: true,
            res_modal_message: message,
            res_modal_status: status
          }));
          setBaseDocumentsTableState((prevState) => ({
            ...prevState
          }));
        }
      },
      (error) => {
        setBaseDocumentsTableState((prevState) => ({
          ...prevState,
          isLoaded: {
            ...prevState.isLoaded,
            [baseDocumentsTableState.category]: true
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

  const closePreviewWindow = () => {
    setBaseDocumentsTableState((prevState) => ({
      ...prevState,
      showPreview: false
    }));
  };

  const closeRejectWarningWindow = () => {
    setBaseDocumentsTableState((prevState) => ({
      ...prevState,
      rejectProfileFileModel: false
    }));
  };

  const handleRejectMessage = (e, rejectmessage) => {
    e.preventDefault();
    setBaseDocumentsTableState((prevState) => ({
      ...prevState,
      feedback: rejectmessage
    }));
  };

  const showPreview = (e, path, doc_key, category, student_id) => {
    e.preventDefault();
    setBaseDocumentsTableState((prevState) => ({
      ...prevState,
      showPreview: true,
      preview_path: path,
      doc_key: doc_key,
      category,
      student_id
    }));
  };

  const onUpdateProfileDocStatus = (e, category, student_id, status) => {
    e.preventDefault();
    if (status === 'accepted') {
      setBaseDocumentsTableState((prevState) => ({
        ...prevState,
        student_id,
        category,
        status,
        acceptProfileFileModel: true
      }));
    } else {
      setBaseDocumentsTableState((prevState) => ({
        ...prevState,
        student_id,
        category,
        status,
        rejectProfileFileModel: true
      }));
    }
  };

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
    baseDocumentsTableState.students
  );

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
              <IconButton>{FILE_UPLOADED_SYMBOL}</IconButton>
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
              style={{
                textDecoration: 'none',
                cursor: 'pointer',
                display: 'flex'
              }}
            >
              <IconButton>{FILE_OK_SYMBOL}</IconButton>{' '}
              {`${params.value?.status || ''}`}
            </Box>
          );
        } else if (params.value?.status === DocumentStatus.Rejected) {
          return (
            <>
              <IconButton>{FILE_NOT_OK_SYMBOL}</IconButton>{' '}
              {`${params.value?.status || ''}`}
            </>
          );
        } else if (params.value?.status === DocumentStatus.NotNeeded) {
          return (
            <>
              <IconButton>{FILE_DONT_CARE_SYMBOL}</IconButton>
              {`${params.value?.status || ''}`}
            </>
          );
        } else {
          return (
            <>
              <IconButton>{FILE_MISSING_SYMBOL}</IconButton>
            </>
          );
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

  return (
    <Box>
      <MuiDataGrid
        columns={baseDocumentColumns}
        rows={student_profile_transformed}
      />
      <AcceptProfileFileModel
        showPreview={baseDocumentsTableState.showPreview}
        closePreviewWindow={closePreviewWindow}
        path={baseDocumentsTableState.preview_path}
        preview_path={baseDocumentsTableState.preview_path}
        student_id={baseDocumentsTableState.student_id}
        isLoaded={baseDocumentsTableState.isLoaded}
        k={baseDocumentsTableState.doc_key}
        onUpdateProfileDocStatus={onUpdateProfileDocStatus}
      />
      <ModalNew
        open={baseDocumentsTableState.rejectProfileFileModel}
        onClose={closeRejectWarningWindow}
        aria-labelledby="contained-modal-title-vcenter"
      >
        <Typography variant="h6">Warning</Typography>
        <Typography variant="body1">
          Please give a reason why the uploaded{' '}
          {baseDocumentsTableState.category} is invalied?
        </Typography>
        <TextField
          type="text"
          placeholder="ex. Poor scanned quality."
          onChange={(e) => handleRejectMessage(e, e.target.value)}
        />
        <Box>
          <Button
            disabled={baseDocumentsTableState.feedback === ''}
            onClick={(e) => onUpdateProfileFilefromstudent(e)}
          >
            {!baseDocumentsTableState.isLoaded ? (
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
