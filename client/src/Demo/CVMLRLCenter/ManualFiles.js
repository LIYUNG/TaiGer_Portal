import React, { useState } from 'react';

import ManualFilesList from './ManualFilesList';
import ToggleableUploadFileForm from './ToggleableUploadFileForm';
import { is_TaiGer_role } from '../Utils/checking-functions';
import { useAuth } from '../../components/AuthProvider';

function ManualFiles(props) {
  const { user } = useAuth();
  const [categoryState, setCategory] = useState('');

  const handleCreateGeneralMessageThread = (e, studentId, fileCategory) => {
    e.preventDefault();
    if (!categoryState) {
      alert('Please select file type');
    } else {
      props.initGeneralFileThread(e, studentId, fileCategory);
      setCategory({ category: '' });
    }
  };

  const handleCreateProgramSpecificMessageThread = (
    e,
    studentId,
    programId,
    fileCategory
  ) => {
    e.preventDefault();
    if (!categoryState) {
      alert('Please select file type');
    } else {
      props.initProgramSpecificFileThread(
        e,
        studentId,
        programId,
        fileCategory
      );
      setCategory('');
    }
  };

  const handleSelect = (e) => {
    e.preventDefault();
    setCategory(e.target.value);
  };

  return (
    <>
      <ManualFilesList
        student={props.student}
        onDeleteFileThread={props.onDeleteFileThread}
        handleAsFinalFile={props.handleAsFinalFile}
        application={props.application}
      />
      {is_TaiGer_role(user) &&
        (!props.application ||
          (props.application && props.application.closed !== 'O')) && (
          <ToggleableUploadFileForm
            role={user.role}
            user={user}
            student={props.student}
            handleSelect={handleSelect}
            handleCreateGeneralMessageThread={handleCreateGeneralMessageThread}
            handleCreateProgramSpecificMessageThread={
              handleCreateProgramSpecificMessageThread
            }
            category={categoryState}
            filetype={props.filetype}
            application={props.application}
          />
        )}
    </>
  );
}

export default ManualFiles;
