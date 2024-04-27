import React from 'react';
import { Grid, Button, Link, Typography } from '@mui/material';
import { Link as LinkDom } from 'react-router-dom';
import CheckIcon from '@mui/icons-material/Check';
import { AiOutlineDelete, AiOutlineUndo } from 'react-icons/ai';
import { IoCheckmarkCircle } from 'react-icons/io5';
import { useTranslation } from 'react-i18next';

import { is_TaiGer_role, latestReplyInfo } from '../Utils/checking-functions';
import { convertDate } from '../Utils/contants';
import DEMO from '../../store/constant';
import { useAuth } from '../../components/AuthProvider';

function EditableFile_Thread(props) {
  const { user } = useAuth();
  const { t } = useTranslation();
  const handleAsFinalFileThread = (documenName, isFinal) => {
    props.handleAsFinalFile(
      props.thread.doc_thread_id._id,
      props.student._id,
      props.program_id,
      isFinal,
      documenName
    );
  };

  const handleDeleteFileThread = (documenName) => {
    props.onDeleteFileThread(
      props.thread.doc_thread_id._id,
      props.application,
      props.student._id,
      documenName
    );
  };

  let fileStatus;
  let documenName;
  if (props.application) {
    documenName = props.thread.doc_thread_id?.file_type;
    // program_deadline = props.application.programId.application_deadline
  } else {
    documenName = 'General' + ' - ' + props.thread.doc_thread_id?.file_type;
  }

  fileStatus = (
    <>
      <Grid container spacing={2}>
        <Grid item xs={1}>
          {!is_TaiGer_role(user) ? (
            props.thread.isFinalVersion && (
              <IoCheckmarkCircle
                size={24}
                color="limegreen"
                title="Final Version"
              />
            )
          ) : props.thread.isFinalVersion ? (
            <IoCheckmarkCircle
              size={24}
              color="limegreen"
              title="Final Version"
            />
          ) : (
            <Button
              size="small"
              variant="outlined"
              title="Set as final version"
              onClick={() => handleAsFinalFileThread(documenName, true)}
              startIcon={<CheckIcon size={24} color="success" />}
            ></Button>
          )}
        </Grid>
        <Grid item xs={1}>
          {props.thread.isFinalVersion ? (
            is_TaiGer_role(user) ? (
              <AiOutlineUndo
                size={24}
                color="red"
                title="Un do Final Version"
                style={{ cursor: 'pointer' }}
                onClick={() => handleAsFinalFileThread(documenName, false)}
              />
            ) : (
              <Typography color="error.main">{t('Closed')}</Typography>
            )
          ) : (
            <></>
          )}
        </Grid>
        <Grid item xs={4}>
          <Link
            to={DEMO.DOCUMENT_MODIFICATION_LINK(
              props.thread.doc_thread_id?._id
            )}
            component={LinkDom}
            target="_blank"
          >
            <Typography color={props.decided === 'O' ? 'primary' : 'grey'}>
              {documenName}
            </Typography>
          </Link>
        </Grid>
        <Grid item xs={2}>
          {convertDate(props.thread.doc_thread_id?.updatedAt)}
        </Grid>
        <Grid item xs={2}>
          {latestReplyInfo(props.thread.doc_thread_id)}
        </Grid>
        {is_TaiGer_role(user) && (
          <Grid item xs={1}>
            <Button
              size="small"
              style={{ cursor: 'pointer' }}
              title="Delete"
              variant="contained"
              color="error"
              onClick={() => handleDeleteFileThread(documenName)}
            >
              <AiOutlineDelete size={20} />
            </Button>
          </Grid>
        )}
      </Grid>
    </>
  );

  return <>{fileStatus}</>;
}

export default EditableFile_Thread;
