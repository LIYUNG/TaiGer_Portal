import React, { Component } from 'react';
import EditableFile_Thread from './EditableFile_Thread';

class ManualFilesList extends Component {
  render() {
    let message_threads;
    if (this.props.application === null) {
      message_threads = this.props.student.generaldocs_threads
        ? this.props.student.generaldocs_threads.map((thread) => (
            <EditableFile_Thread
              key={thread._id}
              thread={thread}
              student={this.props.student}
              application={this.props.application}
              decided={'O'}
              onFormSubmit={this.props.onFormSubmit}
              onTrashClick={this.props.onTrashClick}
              onDeleteProgramSpecificThread={
                this.props.onDeleteProgramSpecificThread
              }
              onDeleteFileThread={this.props.onDeleteFileThread}
              handleAsFinalFile={this.props.handleAsFinalFile}
              user={this.props.user}
            />
          ))
        : '';
    } else {
      message_threads =
        this.props.application && this.props.application.doc_modification_thread
          ? this.props.application.doc_modification_thread.map((thread) => (
              <EditableFile_Thread
                key={thread._id}
                thread={thread}
                application={this.props.application}
                decided={this.props.application.decided}
                program_id={this.props.application.programId._id}
                student={this.props.student}
                onTrashClick={this.props.onTrashClick}
                onDeleteProgramSpecificThread={
                  this.props.onDeleteProgramSpecificThread
                }
                handleAsFinalFile={this.props.handleAsFinalFile}
                onDeleteFileThread={this.props.onDeleteFileThread}
                user={this.props.user}
              />
            ))
          : '';
    }

    return <>{message_threads}</>;
  }
}

export default ManualFilesList;
