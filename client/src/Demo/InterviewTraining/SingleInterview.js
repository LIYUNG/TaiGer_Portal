import React from 'react';
import { Button, Card, Modal, Spinner } from 'react-bootstrap';

import SingleInterviewView from './SingleInterviewView';
import SingleInterviewEdit from './SingleInterviewEdit';
import { spinner_style } from '../Utils/contants';
import ErrorPage from '../Utils/ErrorPage';
import ModalMain from '../Utils/ModalHandler/ModalMain';

import { deleteInterview, getInterview, updateInterview } from '../../api';
import { TabTitle } from '../Utils/TabTitle';
import InterviewItems from './InterviewItems';
import DEMO from '../../store/constant';
import { Link } from 'react-router-dom';
import { AiFillCheckCircle } from 'react-icons/ai';

class SingleInterview extends React.Component {
  state = {
    error: '',
    author: '',
    isLoaded: false,
    success: false,
    isDeleteSuccessful: false,
    interview: {},
    editorState: null,
    isEdit: true,
    res_status: 0,
    res_modal_message: '',
    res_modal_status: 0
  };
  componentDidMount() {
    getInterview(this.props.match.params.interview_id).then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        if (!data) {
          this.setState({ isLoaded: true, res_status: status });
        }
        if (success) {
          var initialEditorState = null;
          const author = data.author;
          if (data.interview_description) {
            initialEditorState = JSON.parse(data.interview_description);
          } else {
            initialEditorState = { time: new Date(), blocks: [] };
          }
          this.setState({
            isLoaded: true,
            interview: data,
            editorState: initialEditorState,
            author,
            success: success,
            res_status: status
          });
        } else {
          this.setState({
            isLoaded: true,
            res_status: status
          });
        }
      },
      (error) => {
        this.setState((state) => ({
          ...state,
          isLoaded: true,
          error,
          res_status: 500
        }));
      }
    );
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.match.params.interview_id !==
      this.props.match.params.interview_id
    ) {
      getInterview(this.props.match.params.interview_id).then(
        (resp) => {
          const { data, success } = resp.data;
          const { status } = resp;
          if (!data) {
            this.setState({ isLoaded: true, res_status: status });
          }
          if (success) {
            var initialEditorState = null;
            const author = data.author;
            if (data.interview_description) {
              initialEditorState = JSON.parse(data.interview_description);
            } else {
              initialEditorState = { time: new Date(), blocks: [] };
            }
            this.setState({
              isLoaded: true,
              interview: data,
              editorState: initialEditorState,
              author,
              success: success,
              res_status: status
            });
          } else {
            this.setState({
              isLoaded: true,
              res_status: status
            });
          }
        },
        (error) => {
          this.setState((state) => ({
            ...state,
            isLoaded: true,
            error,
            res_status: 500
          }));
        }
      );
    }
  }

  handleClickEditToggle = (e) => {
    this.setState((state) => ({ ...state, isEdit: !this.state.isEdit }));
  };
  handleClickSave = (e, interview, editorState) => {
    e.preventDefault();
    const message = JSON.stringify(editorState);
    const interviewData_temp = interview;
    interviewData_temp.interview_description = message;
    updateInterview(
      this.props.match.params.interview_id,
      interviewData_temp
    ).then(
      (resp) => {
        const { success, data } = resp.data;
        const { status } = resp;
        if (success) {
          this.setState({
            success,
            interview: data,
            editorState,
            isEdit: !this.state.isEdit,
            author: data.author,
            isLoaded: true,
            res_modal_status: status
          });
        } else {
          const { message } = resp.data;
          this.setState((state) => ({
            ...state,
            isLoaded: true,
            res_modal_message: message,
            res_modal_status: status
          }));
        }
      },
      (error) => {
        this.setState({ error });
      }
    );
    this.setState((state) => ({ ...state, in_edit_mode: false }));
  };

  openDeleteDocModalWindow = (interview) => {
    this.setState((state) => ({
      ...state,
      interview_id_toBeDelete: interview._id,
      interview_name_toBeDelete: `${interview.program_id.school} ${interview.program_id.program_name}`,
      SetDeleteDocModel: true
    }));
  };

  closeDeleteDocModalWindow = (e) => {
    this.setState((state) => ({
      ...state,
      SetDeleteDocModel: false
    }));
  };

  handleDeleteInterview = (doc) => {
    deleteInterview(this.state.interview._id.toString()).then(
      (resp) => {
        const { success } = resp.data;
        const { status } = resp;
        if (success) {
          this.setState({
            success,
            SetDeleteDocModel: false,
            isEdit: false,
            isDeleteSuccessful: true,
            interview: null,
            isLoaded: true,
            res_modal_status: status
          });
        } else {
          const { message } = resp.data;
          this.setState((state) => ({
            ...state,
            isLoaded: true,
            res_modal_message: message,
            res_modal_status: status
          }));
        }
      },
      (error) => {
        const { statusText } = resp;
        this.setState((state) => ({
          ...state,
          isLoaded: true,
          error,
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

  render() {
    const {
      res_status,
      editorState,
      interview,
      isDeleteSuccessful,
      isLoaded,
      res_modal_status,
      res_modal_message
    } = this.state;

    if (!isLoaded && !editorState) {
      return (
        <div style={spinner_style}>
          <Spinner animation="border" role="status">
            <span className="visually-hidden"></span>
          </Spinner>
        </div>
      );
    }

    if (res_status >= 400) {
      return <ErrorPage res_status={res_status} />;
    }
    TabTitle(`Interview: ${this.state.document_title}`);
    return (
      <>
        {res_modal_status >= 400 && (
          <ModalMain
            ConfirmError={this.ConfirmError}
            res_modal_status={res_modal_status}
            res_modal_message={res_modal_message}
          />
        )}
        <Link to={DEMO.INTERVIEW_LINK}>
          <Button>Back</Button>
        </Link>
        {interview ? (
          <InterviewItems
            user={this.props.user}
            expanded={true}
            readOnly={false}
            interview={interview}
            openDeleteDocModalWindow={this.openDeleteDocModalWindow}
          />
        ) : isDeleteSuccessful ? (
          <Card>
            <AiFillCheckCircle color="limegreen" size={24} title="Confirmed" />{' '}
            &nbsp; Interview request deleted successfully!
          </Card>
        ) : (
          <Card>Status 404: Error! Interview not found'</Card>
        )}

        <Modal
          show={this.state.SetDeleteDocModel}
          onHide={this.closeDeleteDocModalWindow}
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header>
            <Modal.Title id="contained-modal-title-vcenter">
              Warning
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Do you want to delete the interview request of{' '}
            <b>{this.state.interview_name_toBeDelete}</b>?
          </Modal.Body>
          <Modal.Footer>
            <Button disabled={!isLoaded} onClick={this.handleDeleteInterview}>
              Yes
            </Button>

            <Button onClick={this.closeDeleteDocModalWindow}>No</Button>
          </Modal.Footer>
        </Modal>
        {/* <SingleInterviewEdit
            user={this.props.user}
            interview={interview}
            editorState={this.state.editorState}
            author={this.state.author}
            isLoaded={isLoaded}
            handleClickEditToggle={this.handleClickEditToggle}
            handleClickSave={this.handleClickSave}
          /> */}
      </>
    );
  }
}
export default SingleInterview;
