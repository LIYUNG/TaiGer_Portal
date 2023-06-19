import React from 'react';
import { Row, Col, Table, Card, Spinner } from 'react-bootstrap';
import ButtonSetUploaded from './ButtonSetUploaded';
import ButtonSetAccepted from './ButtonSetAccepted';
import ButtonSetRejected from './ButtonSetRejected';
import ButtonSetNotNeeded from './ButtonSetNotNeeded';
import ButtonSetMissing from './ButtonSetMissing';
import ModalMain from '../Utils/ModalHandler/ModalMain';
import {
  spinner_style,
  convertDate,
  profile_wtih_doc_link_list,
  profile_list
} from '../Utils/contants';

import {
  uploadforstudent,
  updateProfileDocumentStatus,
  deleteFile,
  updateDocumentationHelperLink
} from '../../api';
import { is_TaiGer_AdminAgent } from '../Utils/checking-functions';
import Banner from '../../components/Banner/Banner';

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
    let keys2 = Object.keys(profile_wtih_doc_link_list);
    let temp_isLoaded = {};
    for (let i = 0; i < keys2.length; i++) {
      temp_isLoaded[keys2[i]] = true;
    }
    this.setState({
      isLoaded: temp_isLoaded,
      student: this.props.student,
      ready: true
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.student._id.toString() !== this.props.student._id.toString()
    ) {
      this.setState({
        student: this.props.student,
        ready: true
      });
    }
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
            ...state,
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
        const { statusText } = resp;
        this.setState((state) => ({
          ...state,
          isLoaded: {
            ...state.isLoaded,
            [category]: true
          },
          error,
          res_modal_status: 500,
          res_modal_message: statusText
        }));
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
        const { statusText } = resp;
        this.setState((state) => ({
          ...state,
          isLoaded: {
            ...state.isLoaded,
            [category]: true
          },
          error,
          deleteFileWarningModel: false,
          res_modal_status: 500,
          res_modal_message: statusText
        }));
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
            ...state,
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
        const { statusText } = resp;
        this.setState((state) => ({
          ...state,
          isLoaded: {
            ...state.isLoaded,
            [category]: true
          },
          error,
          res_modal_status: 500,
          res_modal_message: statusText
        }));
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
      (error) => {
        const { message } = resp.data;
        this.setState((state) => ({
          ...state,
          error,
          isLoaded2: true,
          res_modal_message: message,
          res_modal_status: status
        }));
      }
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
    // TODO: what if this.state.student.profile[i].name key not in base_docs_link[i].key?
    if (this.props.base_docs_link) {
      this.props.base_docs_link.forEach((baseDoc) => {
        object_init[baseDoc.key].link = baseDoc.link;
      });
    }
    if (this.state.student.profile) {
      this.state.student.profile.forEach((profile) => {
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
          updateDocLink={this.updateDocLink}
          link={object_init[k].link}
          path={object_init[k].path}
          user={this.props.user}
          isLoaded={this.state.isLoaded[k]}
          docName={value2[i]}
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
          user={this.props.user}
          isLoaded={this.state.isLoaded[k]}
          docName={value2[i]}
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
          user={this.props.user}
          isLoaded={this.state.isLoaded[k]}
          docName={value2[i]}
          time={object_time_init[k]}
          k={k}
          message={object_message[k]}
          student={this.state.student}
          onDeleteFilefromstudent={this.onDeleteFilefromstudent}
          onUpdateProfileFilefromstudent={this.onUpdateProfileFilefromstudent}
          deleteFileWarningModel={this.state.deleteFileWarningModel}
        />
      ) : object_init[k].status === 'notneeded' ? (
        is_TaiGer_AdminAgent(this.props.user) && (
          <ButtonSetNotNeeded
            key={i + 1}
            updateDocLink={this.updateDocLink}
            link={object_init[k].link}
            user={this.props.user}
            isLoaded={this.state.isLoaded[k]}
            docName={value2[i]}
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
          user={this.props.user}
          isLoaded={this.state.isLoaded[k]}
          docName={value2[i]}
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
          <Col>
            <Banner
              ReadOnlyMode={true}
              bg={'primary'}
              title={'Info:'}
              path={'/'}
              text={
                '每個檔案都有注意事項。請務必上傳文件前，點選說明連結並查看。'
              }
              link_name={''}
              removeBanner={this.removeBanner}
              notification_key={'x'}
            />
            <Banner
              ReadOnlyMode={true}
              bg={'danger'}
              title={'Attention:'}
              path={'/'}
              text={
                '無論是申請大學部或是碩士班，高中文件、學測或統測成績單為必要文件。德國學校通常列為必要文件'
              }
              link_name={''}
              removeBanner={this.removeBanner}
              notification_key={'x'}
            />
          </Col>
          <Table
            responsive
            bordered
            hover
            className="py-0 my-0 mx-0"
            variant="dark"
            text="light"
            size="sm"
          >
            <thead>
              <tr>
                <th>Status</th>
                <th>File Name:</th>
                <th>Updated</th>
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
