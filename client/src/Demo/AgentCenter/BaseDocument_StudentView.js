import React from 'react';
import { Row, Col, Table, Card, Spinner } from 'react-bootstrap';
import ButtonSetUploaded from './ButtonSetUploaded';
import ButtonSetAccepted from './ButtonSetAccepted';
import ButtonSetRejected from './ButtonSetRejected';
import ButtonSetNotNeeded from './ButtonSetNotNeeded';
import ButtonSetMissing from './ButtonSetMissing';
import ModalMain from '../Utils/ModalHandler/ModalMain';
import {
  SYMBOL_EXPLANATION,
  split_header,
  spinner_style,
  spinner_style2
} from '../Utils/contants';

import {
  uploadforstudent,
  updateProfileDocumentStatus,
  deleteFile,
  updateDocumentationHelperLink
} from '../../api';

class BaseDocument_StudentView extends React.Component {
  state = {
    error: '',
    student: this.props.student,
    student_id: '',
    // isLoaded: this.props.isLoaded,
    isLoaded: {},
    ready: false,
    docName: '',
    file: '',
    deleteFileWarningModel: false,
    res_status: 0,
    res_modal_status: ''
  };

  componentDidMount() {
    let keys2 = Object.keys(window.profile_wtih_doc_link_list);
    let temp_isLoaded = {};
    for (let i = 0; i < keys2.length; i++) {
      temp_isLoaded[keys2[i]] = true;
    }
    this.setState({ isLoaded: temp_isLoaded, ready: true });
  }

  onUpdateProfileFilefromstudent = (category, student_id, status, feedback) => {
    this.setState((state) => ({
      isLoaded: {
        ...state.isLoaded,
        [category]: false
      }
    }));
    updateProfileDocumentStatus(category, student_id, status, feedback).then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        if (success) {
          this.setState((state) => ({
            ...state,
            student: data,
            success,
            isLoaded: {
              ...state.isLoaded,
              [category]: true
            },
            res_modal_status: status
          }));
        } else {
          // TODO: redesign, modal ist better!
          const { message } = resp.data;
          this.setState((state) => ({
            isLoaded: {
              ...state.isLoaded,
              [category]: true
            },
            res_modal_message: message,
            res_modal_status: status
          }));
        }
      },
      (error) => {
        this.setState({
          isLoaded: true,
          error
        });
      }
    );
  };

  onDeleteFilefromstudent = (category, student_id) => {
    // e.preventDefault();
    let student_new = { ...this.state.student };
    let idx = student_new.profile.findIndex((doc) => doc.name === category);
    this.setState((state) => ({
      isLoaded: {
        ...state.isLoaded,
        [category]: false
      }
    }));
    deleteFile(category, student_id).then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        if (success) {
          student_new.profile[idx] = data;
          this.setState((state) => ({
            ...state,
            student_id: '',
            category: '',
            isLoaded: {
              ...state.isLoaded,
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
          this.setState((state) => ({
            isLoaded: {
              ...state.isLoaded,
              [category]: true
            },
            deleteFileWarningModel: false,
            res_modal_message: message,
            res_modal_status: status
          }));
        }
      },
      (error) => {
        this.setState({
          isLoaded: true,
          error: true
        });
      }
    );
  };

  ConfirmError = () => {
    this.setState((state) => ({
      ...state,
      res_modal_status: 0,
      res_modal_message: ''
    }));
  };

  handleGeneralDocSubmit = (e, fileCategory, studentId) => {
    e.preventDefault();
    this.onSubmitGeneralFile(e, e.target.files[0], fileCategory, studentId);
  };

  onSubmitGeneralFile = (e, NewFile, category, student_id) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', NewFile);

    this.setState((state) => ({
      isLoaded: {
        ...state.isLoaded,
        [category]: false
      }
    }));
    uploadforstudent(category, student_id, formData).then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        if (success) {
          this.setState((state) => ({
            ...state,
            student: data, // resp.data = {success: true, data:{...}}
            success,
            category: '',
            isLoaded: {
              ...state.isLoaded,
              [category]: true
            },
            file: '',
            res_modal_status: status
          }));
        } else {
          // TODO: what if data is oversize? data type not match?
          const { message } = resp.data;
          this.setState((state) => ({
            isLoaded: {
              ...state.isLoaded,
              [category]: true
            },
            res_modal_message: message,
            res_modal_status: status
          }));
        }
      },
      (error) => {
        this.setState({
          isLoaded: true,
          error
        });
      }
    );
  };

  updateDocLink = (link, key) => {
    updateDocumentationHelperLink(link, key, 'base-documents').then(
      (resp) => {
        const { helper_link, success } = resp.data;
        const { status } = resp;
        if (success) {
          this.setState((state) => ({
            ...state,
            isLoaded2: true,
            base_docs_link: helper_link,
            success: success,
            res_modal_status: status
          }));
        } else {
          const { message } = resp.data;
          this.setState((state) => ({
            ...state,
            isLoaded2: true,
            res_modal_message: message,
            res_modal_status: status
          }));
        }
      },
      (error) => {}
    );
  };

  render() {
    const { res_modal_status, res_modal_message, ready } = this.state;
    if (!ready) {
      return (
        <div style={spinner_style}>
          <Spinner animation="border" role="status">
            <span className="visually-hidden"></span>
          </Spinner>
        </div>
      );
    }
    let value2 = Object.values(window.profile_list);
    let keys2 = Object.keys(window.profile_wtih_doc_link_list);
    let object_init = {};
    let object_message = {};
    let object_date_init = {};
    let object_time_init = {};
    for (let i = 0; i < keys2.length; i++) {
      object_init[keys2[i]] = { status: 'missing', link: '' };
      object_message[keys2[i]] = '';
      object_date_init[keys2[i]] = '';
      object_time_init[keys2[i]] = '';
    }
    // TODO: what if this.state.student.profile[i].name key not in base_docs_link[i].key?
    if (this.props.base_docs_link) {
      for (let i = 0; i < this.props.base_docs_link.length; i++) {
        object_init[this.props.base_docs_link[i].key].link =
          this.props.base_docs_link[i].link;
      }
    }
    if (this.state.student.profile) {
      for (let i = 0; i < this.state.student.profile.length; i++) {
        let document_split = this.state.student.profile[i].path.replace(
          /\\/g,
          '/'
        );
        if (this.state.student.profile[i].status === 'uploaded') {
          object_init[this.state.student.profile[i].name].status = 'uploaded';
          object_init[this.state.student.profile[i].name].path =
            document_split.split('/')[1];
        } else if (this.state.student.profile[i].status === 'accepted') {
          object_init[this.state.student.profile[i].name].status = 'accepted';
          object_init[this.state.student.profile[i].name].path =
            document_split.split('/')[1];
        } else if (this.state.student.profile[i].status === 'rejected') {
          object_init[this.state.student.profile[i].name].status = 'rejected';
          object_init[this.state.student.profile[i].name].path =
            document_split.split('/')[1];
        } else if (this.state.student.profile[i].status === 'notneeded') {
          object_init[this.state.student.profile[i].name].status = 'notneeded';
        } else if (this.state.student.profile[i].status === 'missing') {
          object_init[this.state.student.profile[i].name].status = 'missing';
        }
        object_message[this.state.student.profile[i].name] = this.state.student
          .profile[i].feedback
          ? this.state.student.profile[i].feedback
          : '';
        object_date_init[this.state.student.profile[i].name] = new Date(
          this.state.student.profile[i].updatedAt
        ).toLocaleDateString();
        object_time_init[this.state.student.profile[i].name] = new Date(
          this.state.student.profile[i].updatedAt
        ).toLocaleTimeString();
      }
    } else {
    }
    var file_information;
    file_information = keys2.map((k, i) =>
      object_init[k].status === 'uploaded' ? (
        <ButtonSetUploaded
          key={i + 1}
          updateDocLink={this.updateDocLink}
          link={object_init[k].link}
          path={object_init[k].path}
          role={this.props.user.role}
          user={this.props.user}
          isLoaded={this.state.isLoaded[k]}
          docName={value2[i]}
          date={object_date_init[k]}
          time={object_time_init[k]}
          k={k}
          student={this.state.student}
          onDeleteFilefromstudent={this.onDeleteFilefromstudent}
          onUpdateProfileFilefromstudent={this.onUpdateProfileFilefromstudent}
        />
      ) : object_init[k].status === 'accepted' ? (
        <ButtonSetAccepted
          key={i + 1}
          updateDocLink={this.updateDocLink}
          link={object_init[k].link}
          path={object_init[k].path}
          role={this.props.user.role}
          user={this.props.user}
          isLoaded={this.state.isLoaded[k]}
          docName={value2[i]}
          date={object_date_init[k]}
          time={object_time_init[k]}
          k={k}
          student={this.state.student}
          onDeleteFilefromstudent={this.onDeleteFilefromstudent}
          onUpdateProfileFilefromstudent={this.onUpdateProfileFilefromstudent}
          deleteFileWarningModel={this.state.deleteFileWarningModel}
        />
      ) : object_init[k].status === 'rejected' ? (
        <ButtonSetRejected
          key={i + 1}
          updateDocLink={this.updateDocLink}
          link={object_init[k].link}
          path={object_init[k].path}
          role={this.props.user.role}
          user={this.props.user}
          isLoaded={this.state.isLoaded[k]}
          docName={value2[i]}
          date={object_date_init[k]}
          time={object_time_init[k]}
          k={k}
          message={object_message[k]}
          student={this.state.student}
          onDeleteFilefromstudent={this.onDeleteFilefromstudent}
          onUpdateProfileFilefromstudent={this.onUpdateProfileFilefromstudent}
          deleteFileWarningModel={this.state.deleteFileWarningModel}
        />
      ) : object_init[k].status === 'notneeded' ? (
        (this.props.user.role === 'Admin' ||
          this.props.user.role === 'Agent') && (
          <ButtonSetNotNeeded
            key={i + 1}
            updateDocLink={this.updateDocLink}
            link={object_init[k].link}
            role={this.props.user.role}
            user={this.props.user}
            isLoaded={this.state.isLoaded[k]}
            docName={value2[i]}
            date={object_date_init[k]}
            time={object_time_init[k]}
            k={k}
            student={this.state.student}
            onDeleteFilefromstudent={this.onDeleteFilefromstudent}
            onUpdateProfileFilefromstudent={this.onUpdateProfileFilefromstudent}
            deleteFileWarningModel={this.state.deleteFileWarningModel}
            handleGeneralDocSubmit={this.handleGeneralDocSubmit}
          />
        )
      ) : (
        <ButtonSetMissing
          key={i + 1}
          updateDocLink={this.updateDocLink}
          link={object_init[k].link}
          role={this.props.user.role}
          user={this.props.user}
          isLoaded={this.state.isLoaded[k]}
          docName={value2[i]}
          date={object_date_init[k]}
          time={object_time_init[k]}
          k={k}
          message={object_message[k]}
          student={this.state.student}
          onDeleteFilefromstudent={this.onDeleteFilefromstudent}
          onUpdateProfileFilefromstudent={this.onUpdateProfileFilefromstudent}
          handleGeneralDocSubmit={this.handleGeneralDocSubmit}
        />
      )
    );

    return (
      <>
        <Row>
          <Table
            responsive
            className="py-0 my-0 mx-0"
            variant="dark"
            text="light"
            size="sm"
          >
            <thead>
              <tr>
                <th>Status</th>
                <th>File Name:</th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>{file_information}</tbody>
          </Table>
        </Row>
        <Row>
          <Col className="md-4">{this.props.SYMBOL_EXPLANATION}</Col>
        </Row>

        {res_modal_status >= 400 && (
          <ModalMain
            ConfirmError={this.ConfirmError}
            res_modal_status={res_modal_status}
            res_modal_message={res_modal_message}
          />
        )}
      </>
    );
  }
}

export default BaseDocument_StudentView;
