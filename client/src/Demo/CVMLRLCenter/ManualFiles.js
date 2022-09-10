import React from 'react';
import ManualFilesList from './ManualFilesList';
import ToggleableUploadFileForm from './ToggleableUploadFileForm';
import { Row, Col, Tabs, Tab, Table } from 'react-bootstrap';

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
        <Table>
          <thead>
            <tr></tr>
          </thead>
          <tbody>
            <ManualFilesList
              student={this.props.student}
              onDeleteFileThread={this.props.onDeleteFileThread}
              handleAsFinalFile={this.props.handleAsFinalFile}
              role={this.props.role}
              application={this.props.application}
            />
          </tbody>
        </Table>
        {this.props.role === 'Student' || this.props.role === 'Guest' ? (
          <></>
        ) : (
          <ToggleableUploadFileForm
            role={this.props.role}
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
        )}
      </>
    );
  }
}

export default ManualFiles;
