import React, { useEffect, useState } from 'react';
import LaunchIcon from '@mui/icons-material/Launch';
import {
  Box,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import { useTranslation } from 'react-i18next';

import ButtonSetUploaded from './ButtonSetUploaded';
import ButtonSetAccepted from './ButtonSetAccepted';
import ButtonSetRejected from './ButtonSetRejected';
import ButtonSetNotNeeded from './ButtonSetNotNeeded';
import ButtonSetMissing from './ButtonSetMissing';
import ModalMain from '../Utils/ModalHandler/ModalMain';
import {
  profile_wtih_doc_link_list,
  profile_list,
  SYMBOL_EXPLANATION
} from '../Utils/contants';
import {
  uploadforstudent,
  updateProfileDocumentStatus,
  deleteFile,
  updateDocumentationHelperLink
} from '../../api';
import { is_TaiGer_AdminAgent } from '../Utils/checking-functions';
import Banner from '../../components/Banner/Banner';
import DEMO from '../../store/constant';
import { useAuth } from '../../components/AuthProvider';
import Loading from '../../components/Loading/Loading';

function BaseDocument_StudentView(props) {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [baseDocumentStudentViewState, setBaseDocumentStudentViewState] =
    useState({
      error: '',
      student: props.student,
      student_id: '',
      isLoaded: {},
      ready: false,
      docName: '',
      file: '',
      deleteFileWarningModel: false,
      res_status: 0,
      res_modal_status: ''
    });

  useEffect(() => {
    let keys2 = Object.keys(profile_wtih_doc_link_list);
    let temp_isLoaded = {};
    for (let i = 0; i < keys2.length; i++) {
      temp_isLoaded[keys2[i]] = true;
    }
    setBaseDocumentStudentViewState((prevState) => ({
      ...prevState,
      isLoaded: temp_isLoaded,
      student: props.student,
      ready: true
    }));
  }, [props.student._id.toString()]);

  const onUpdateProfileFilefromstudent = (
    category,
    student_id,
    status,
    feedback
  ) => {
    setBaseDocumentStudentViewState((prevState) => ({
      ...prevState,
      isLoaded: {
        ...prevState.isLoaded,
        [category]: false
      }
    }));
    updateProfileDocumentStatus(category, student_id, status, feedback).then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        if (success) {
          setBaseDocumentStudentViewState((prevState) => ({
            ...prevState,
            student: data,
            success,
            isLoaded: {
              ...prevState.isLoaded,
              [category]: true
            },
            res_modal_status: status
          }));
        } else {
          // TODO: redesign, modal ist better!
          const { message } = resp.data;
          setBaseDocumentStudentViewState((prevState) => ({
            ...prevState,
            isLoaded: {
              ...prevState.isLoaded,
              [category]: true
            },
            res_modal_message: message,
            res_modal_status: status
          }));
        }
      },
      (error) => {
        setBaseDocumentStudentViewState((prevState) => ({
          ...prevState,
          isLoaded: {
            ...prevState.isLoaded,
            [category]: true
          },
          error,
          res_modal_status: 500,
          res_modal_message: ''
        }));
      }
    );
  };

  const onDeleteFilefromstudent = (category, student_id) => {
    // e.preventDefault();
    let student_new = { ...baseDocumentStudentViewState.student };
    let idx = student_new.profile.findIndex((doc) => doc.name === category);
    setBaseDocumentStudentViewState((prevState) => ({
      ...prevState,
      isLoaded: {
        ...prevState.isLoaded,
        [category]: false
      }
    }));
    deleteFile(category, student_id).then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        if (success) {
          student_new.profile[idx] = data;
          setBaseDocumentStudentViewState((prevState) => ({
            ...prevState,
            student_id: '',
            category: '',
            isLoaded: {
              ...prevState.isLoaded,
              [category]: true
            },
            student: student_new,
            success: success,
            deleteFileWarningModel: false,
            res_modal_status: status
          }));
        } else {
          // TODO: redesign, modal ist better!
          const { message } = resp.data;
          setBaseDocumentStudentViewState((prevState) => ({
            isLoaded: {
              ...prevState.isLoaded,
              [category]: true
            },
            deleteFileWarningModel: false,
            res_modal_message: message,
            res_modal_status: status
          }));
        }
      },
      (error) => {
        setBaseDocumentStudentViewState((prevState) => ({
          ...prevState,
          isLoaded: {
            ...prevState.isLoaded,
            [category]: true
          },
          error,
          deleteFileWarningModel: false,
          res_modal_status: 500,
          res_modal_message: ''
        }));
      }
    );
  };

  const ConfirmError = () => {
    setBaseDocumentStudentViewState((prevState) => ({
      ...prevState,
      res_modal_status: 0,
      res_modal_message: ''
    }));
  };

  const handleGeneralDocSubmit = (e, fileCategory, studentId) => {
    e.preventDefault();
    onSubmitGeneralFile(e, e.target.files[0], fileCategory, studentId);
  };

  const onSubmitGeneralFile = (e, NewFile, category, student_id) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', NewFile);

    setBaseDocumentStudentViewState((prevState) => ({
      ...prevState,
      isLoaded: {
        ...prevState.isLoaded,
        [category]: false
      }
    }));
    uploadforstudent(category, student_id, formData).then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        if (success) {
          setBaseDocumentStudentViewState((prevState) => ({
            ...prevState,
            student: data, // resp.data = {success: true, data:{...}}
            success,
            category: '',
            isLoaded: {
              ...prevState.isLoaded,
              [category]: true
            },
            file: '',
            res_modal_status: status
          }));
        } else {
          // TODO: what if data is oversize? data type not match?
          const { message } = resp.data;
          setBaseDocumentStudentViewState((prevState) => ({
            ...prevState,
            isLoaded: {
              ...prevState.isLoaded,
              [category]: true
            },
            res_modal_message: message,
            res_modal_status: status
          }));
        }
      },
      (error) => {
        setBaseDocumentStudentViewState((prevState) => ({
          ...prevState,
          isLoaded: {
            ...prevState.isLoaded,
            [category]: true
          },
          error,
          res_modal_status: 500,
          res_modal_message: ''
        }));
      }
    );
  };

  const updateDocLink = (link, key) => {
    updateDocumentationHelperLink(link, key, 'base-documents').then(
      (resp) => {
        const { helper_link, success } = resp.data;
        const { status } = resp;
        if (success) {
          setBaseDocumentStudentViewState((prevState) => ({
            ...prevState,
            isLoaded2: true,
            base_docs_link: helper_link,
            success: success,
            res_modal_status: status
          }));
        } else {
          const { message } = resp.data;
          setBaseDocumentStudentViewState((prevState) => ({
            ...prevState,
            isLoaded2: true,
            res_modal_message: message,
            res_modal_status: status
          }));
        }
      },
      (error) => {
        setBaseDocumentStudentViewState((prevState) => ({
          ...prevState,
          error,
          isLoaded2: true,
          res_modal_message: '',
          res_modal_status: 500
        }));
      }
    );
  };

  const { res_modal_status, res_modal_message, ready } =
    baseDocumentStudentViewState;
  if (!ready) {
    return <Loading />;
  }
  let value2 = Object.values(profile_list);
  let keys2 = Object.keys(profile_wtih_doc_link_list);
  let object_init = {};
  let object_message = {};
  let object_time_init = {};
  keys2.forEach((key) => {
    object_init[key] = { status: 'missing', link: '' };
    object_message[key] = '';
    object_time_init[key] = '';
  });
  // TODO: what if baseDocumentStudentViewState.student.profile[i].name key not in base_docs_link[i].key?
  if (props.base_docs_link) {
    props.base_docs_link.forEach((baseDoc) => {
      if (object_init[baseDoc.key]) {
        object_init[baseDoc.key].link = baseDoc.link;
      }
    });
  }
  if (baseDocumentStudentViewState.student.profile) {
    baseDocumentStudentViewState.student.profile.forEach((profile) => {
      let document_split = profile.path.replace(/\\/g, '/');
      let document_name = document_split.split('/')[1];

      switch (profile.status) {
        case 'uploaded':
        case 'accepted':
        case 'rejected':
          object_init[profile.name].status = profile.status;
          object_init[profile.name].path = document_name;
          break;
        case 'notneeded':
        case 'missing':
          object_init[profile.name].status = profile.status;
          break;
      }

      object_message[profile.name] = profile.feedback || '';
      object_time_init[profile.name] = profile.updatedAt;
    });
  }
  var file_information;
  file_information = keys2.map((k, i) =>
    object_init[k].status === 'uploaded' ? (
      <ButtonSetUploaded
        key={i + 1}
        updateDocLink={updateDocLink}
        link={object_init[k].link}
        path={object_init[k].path}
        user={user}
        isLoaded={baseDocumentStudentViewState.isLoaded[k]}
        docName={value2[i]}
        time={object_time_init[k]}
        k={k}
        student={baseDocumentStudentViewState.student}
        onDeleteFilefromstudent={onDeleteFilefromstudent}
        onUpdateProfileFilefromstudent={onUpdateProfileFilefromstudent}
      />
    ) : object_init[k].status === 'accepted' ? (
      <ButtonSetAccepted
        key={i + 1}
        updateDocLink={updateDocLink}
        link={object_init[k].link}
        path={object_init[k].path}
        user={user}
        isLoaded={baseDocumentStudentViewState.isLoaded[k]}
        docName={value2[i]}
        time={object_time_init[k]}
        k={k}
        student={baseDocumentStudentViewState.student}
        onDeleteFilefromstudent={onDeleteFilefromstudent}
        onUpdateProfileFilefromstudent={onUpdateProfileFilefromstudent}
        deleteFileWarningModel={
          baseDocumentStudentViewState.deleteFileWarningModel
        }
      />
    ) : object_init[k].status === 'rejected' ? (
      <ButtonSetRejected
        key={i + 1}
        updateDocLink={updateDocLink}
        link={object_init[k].link}
        path={object_init[k].path}
        user={user}
        isLoaded={baseDocumentStudentViewState.isLoaded[k]}
        docName={value2[i]}
        time={object_time_init[k]}
        k={k}
        message={object_message[k]}
        student={baseDocumentStudentViewState.student}
        onDeleteFilefromstudent={onDeleteFilefromstudent}
        onUpdateProfileFilefromstudent={onUpdateProfileFilefromstudent}
        deleteFileWarningModel={
          baseDocumentStudentViewState.deleteFileWarningModel
        }
      />
    ) : object_init[k].status === 'notneeded' ? (
      is_TaiGer_AdminAgent(user) && (
        <ButtonSetNotNeeded
          key={i + 1}
          updateDocLink={updateDocLink}
          link={object_init[k].link}
          user={user}
          isLoaded={baseDocumentStudentViewState.isLoaded[k]}
          docName={value2[i]}
          time={object_time_init[k]}
          k={k}
          student={baseDocumentStudentViewState.student}
          onDeleteFilefromstudent={onDeleteFilefromstudent}
          onUpdateProfileFilefromstudent={onUpdateProfileFilefromstudent}
          deleteFileWarningModel={
            baseDocumentStudentViewState.deleteFileWarningModel
          }
          handleGeneralDocSubmit={handleGeneralDocSubmit}
        />
      )
    ) : (
      <ButtonSetMissing
        key={i + 1}
        updateDocLink={updateDocLink}
        link={object_init[k].link}
        user={user}
        isLoaded={baseDocumentStudentViewState.isLoaded[k]}
        docName={value2[i]}
        time={object_time_init[k]}
        k={k}
        message={object_message[k]}
        student={baseDocumentStudentViewState.student}
        onDeleteFilefromstudent={onDeleteFilefromstudent}
        onUpdateProfileFilefromstudent={onUpdateProfileFilefromstudent}
        handleGeneralDocSubmit={handleGeneralDocSubmit}
      />
    )
  );

  return (
    <Box>
      <Banner
        ReadOnlyMode={true}
        bg={'primary'}
        title={'info'}
        path={'/'}
        text={
          <Typography variant="body2">
            每個檔案都有注意事項。請務必上傳文件前，點選各文件名稱旁的說明連結圖示
            <IconButton>
              <Button
                size="small"
                variant="outlined"
                endIcon={<LaunchIcon fontSize="small" />}
              >
                {t('Read More')}
              </Button>
            </IconButton>
            並查看文件要求，照著我們的要求上傳，Agent 會再檢查文件是否沒問題。
          </Typography>
        }
        link_name={''}
        removeBanner={<></>}
        notification_key={undefined}
      />
      <Banner
        ReadOnlyMode={true}
        bg={'danger'}
        title={'info'}
        path={`${DEMO.SURVEY_LINK}`}
        text={
          '無論是申請大學部或是碩士班，高中文件、學測或統測成績單為必要文件。德國學校通常列為必要文件，此文件會因為您的背景況狀有所變動。請先填好'
        }
        link_name={
          <Typography variant="body2">
            {t('Profile', { ns: 'common' })}{' '}
            <IconButton>
              <LaunchIcon fontSize="small" />
            </IconButton>
          </Typography>
        }
        removeBanner={undefined}
        notification_key={undefined}
      />
      <TableContainer style={{ overflowX: 'auto' }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>{t('Status', { ns: 'common' })}</TableCell>
              <TableCell>{t('File Name', { ns: 'common' })}</TableCell>
              <TableCell>{t('Update', { ns: 'common' })}</TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell>{t('Delete', { ns: 'common' })}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{file_information}</TableBody>
        </Table>
      </TableContainer>
      {SYMBOL_EXPLANATION}
      {res_modal_status >= 400 && (
        <ModalMain
          ConfirmError={ConfirmError}
          res_modal_status={res_modal_status}
          res_modal_message={res_modal_message}
        />
      )}
    </Box>
  );
}

export default BaseDocument_StudentView;
