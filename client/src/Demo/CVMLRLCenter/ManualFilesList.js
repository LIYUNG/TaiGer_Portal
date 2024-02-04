import React from 'react';

import EditableFile_Thread from './EditableFile_Thread';

function ManualFilesList(props) {
  let message_threads;
  if (props.application === null) {
    message_threads = props.student.generaldocs_threads
      ? props.student.generaldocs_threads.map((thread) => (
          <EditableFile_Thread
            key={thread._id}
            thread={thread}
            student={props.student}
            application={props.application}
            decided={'O'}
            onFormSubmit={props.onFormSubmit}
            onTrashClick={props.onTrashClick}
            onDeleteProgramSpecificThread={props.onDeleteProgramSpecificThread}
            onDeleteFileThread={props.onDeleteFileThread}
            handleAsFinalFile={props.handleAsFinalFile}
          />
        ))
      : '';
  } else {
    message_threads =
      props.application && props.application.doc_modification_thread
        ? props.application.doc_modification_thread.map((thread) => (
            <EditableFile_Thread
              key={thread._id}
              thread={thread}
              application={props.application}
              decided={props.application.decided}
              program_id={props.application.programId._id}
              student={props.student}
              onTrashClick={props.onTrashClick}
              onDeleteProgramSpecificThread={
                props.onDeleteProgramSpecificThread
              }
              handleAsFinalFile={props.handleAsFinalFile}
              onDeleteFileThread={props.onDeleteFileThread}
            />
          ))
        : '';
  }

  return <>{message_threads}</>;
}

export default ManualFilesList;
