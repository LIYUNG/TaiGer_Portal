import React from 'react';

import EditableFileThread from './EditableFileThread';

const ManualFilesList = (props) => {
    let message_threads;
    if (props.application === null) {
        message_threads = props.student.generaldocs_threads
            ? props.student.generaldocs_threads.map((thread) => (
                  <EditableFileThread
                      application={props.application}
                      decided="O"
                      handleAsFinalFile={props.handleAsFinalFile}
                      key={thread._id}
                      onDeleteFileThread={props.onDeleteFileThread}
                      onDeleteProgramSpecificThread={
                          props.onDeleteProgramSpecificThread
                      }
                      onFormSubmit={props.onFormSubmit}
                      onTrashClick={props.onTrashClick}
                      student={props.student}
                      thread={thread}
                  />
              ))
            : '';
    } else {
        message_threads =
            props.application && props.application.doc_modification_thread
                ? props.application.doc_modification_thread.map((thread) => (
                      <EditableFileThread
                          application={props.application}
                          decided={props.application.decided}
                          handleAsFinalFile={props.handleAsFinalFile}
                          key={thread._id}
                          onDeleteFileThread={props.onDeleteFileThread}
                          onDeleteProgramSpecificThread={
                              props.onDeleteProgramSpecificThread
                          }
                          onTrashClick={props.onTrashClick}
                          program_id={props.application.programId._id}
                          student={props.student}
                          thread={thread}
                      />
                  ))
                : '';
    }

    return message_threads;
};

export default ManualFilesList;
