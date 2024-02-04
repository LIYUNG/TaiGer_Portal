import React from 'react';
import { Grid, Button, Link } from '@mui/material';
import { Link as LinkDom } from 'react-router-dom';
import { AiOutlineDelete, AiOutlineCheck, AiOutlineUndo } from 'react-icons/ai';
import { IoCheckmarkCircle } from 'react-icons/io5';
import { useTranslation } from 'react-i18next';

import { is_TaiGer_role } from '../Utils/checking-functions';
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
  let school_program_name;
  if (props.application) {
    school_program_name =
      props.application.programId.school +
      ' - ' +
      props.application.programId.degree +
      ' - ' +
      props.application.programId.program_name;
    documenName =
      props.student.firstname +
      ' - ' +
      props.student.lastname +
      ' ' +
      school_program_name +
      ' ' +
      props.thread.doc_thread_id?.file_type;
    // program_deadline = props.application.programId.application_deadline
  } else {
    documenName =
      props.student.firstname +
      ' - ' +
      props.student.lastname +
      ' ' +
      props.thread.doc_thread_id?.file_type;
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
            <AiOutlineCheck
              size={24}
              color="white"
              style={{ cursor: 'pointer' }}
              title="Set as final version"
              onClick={() => handleAsFinalFileThread(documenName, true)}
            />
          )}
        </Grid>
        <Grid item xs={1}>
          {props.thread.isFinalVersion ? (
            user.role !== 'Student' && user.role !== 'Guest' ? (
              <AiOutlineUndo
                size={24}
                color="red"
                title="Un do Final Version"
                style={{ cursor: 'pointer' }}
                onClick={() => handleAsFinalFileThread(documenName, false)}
              />
            ) : (
              <p className="text-warning">{t('Closed')}</p>
            )
          ) : (
            <></>
          )}
        </Grid>
        <Grid item xs={6}>
          <Link
            to={DEMO.DOCUMENT_MODIFICATION_LINK(
              props.thread.doc_thread_id?._id
            )}
            component={LinkDom}
          >
            {documenName}
          </Link>
        </Grid>
        <Grid item xs={2}>
          {convertDate(props.thread.doc_thread_id?.updatedAt)}
        </Grid>
        {is_TaiGer_role(user) && (
          <Grid item xs={1}>
            <Button
              size="small"
              style={{ cursor: 'pointer' }}
              title="Delete"
              variant="contained"
              color="secondary"
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
