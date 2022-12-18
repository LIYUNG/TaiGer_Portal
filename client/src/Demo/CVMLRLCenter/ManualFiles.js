import React from 'react';
import ManualFilesList from './ManualFilesList';
import ToggleableUploadFileForm from './ToggleableUploadFileForm';
import { shownButtonMyOwnStudent } from '../Utils/checking-functions';

class ManualFiles extends React.Component {
  state = {
    category: ''
  };

  handleCreateGeneralMessageThread = (
    e,
    studentId,
    fileCategory,
    thread_name
  ) => {
    e.preventDefault();
    if (!this.state.category) {
      alert('Please select file type');
    } else {
      this.props.initGeneralFileThread(e, studentId, fileCategory, thread_name);
      this.setState({ category: '' });
    }
  };

  handleCreateProgramSpecificMessageThread = (
    e,
    studentId,
    programId,
    fileCategory,
    thread_name
  ) => {
    e.preventDefault();
    if (!this.state.category) {
      alert('Please select file type');
    } else {
      this.props.initProgramSpecificFileThread(
        e,
        studentId,
        programId,
        fileCategory,
        thread_name
      );
      this.setState({ category: '' });
    }
  };

  handleSelect = (e) => {
    e.preventDefault();
    this.setState({ category: e.target.value });
  };
  render() {
    return (
      <>
        <ManualFilesList
          student={this.props.student}
          onDeleteFileThread={this.props.onDeleteFileThread}
          handleAsFinalFile={this.props.handleAsFinalFile}
          user={this.props.user}
          application={this.props.application}
        />

        {this.props.user.role === 'Student' ||
        this.props.user.role === 'Guest' ? (
          <></>
        ) : (
          (!this.props.application ||
            (this.props.application &&
              this.props.application.closed !== 'O')) &&
          shownButtonMyOwnStudent(
            this.props.user,
            this.props.student._id.toString()
          ) && (
            <ToggleableUploadFileForm
              role={this.props.user.role}
              user={this.props.user}
              student={this.props.student}
              handleSelect={this.handleSelect}
              handleCreateGeneralMessageThread={
                this.handleCreateGeneralMessageThread
              }
              handleCreateProgramSpecificMessageThread={
                this.handleCreateProgramSpecificMessageThread
              }
              category={this.state.category}
              filetype={this.props.filetype}
              application={this.props.application}
            />
          )
        )}
      </>
    );
  }
}

export default ManualFiles;
