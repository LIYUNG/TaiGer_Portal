import React from 'react';
import { Button, Modal } from 'react-bootstrap';

import Aux from '../../hoc/_Aux';
import SurveyEditableComponent from './SurveyEditableComponent';
import ErrorPage from '../Utils/ErrorPage';
import ModalMain from '../Utils/ModalHandler/ModalMain';

import {
  updateAcademicBackground,
  updateLanguageSkill,
  updateApplicationPreference,
  updateDocumentationHelperLink
} from '../../api';

class SurveyComponent extends React.Component {
  state = {
    error: '',
    isLoaded: this.props.isLoaded,
    student_id: this.props.student_id,
    success: false,
    academic_background: this.props.academic_background,
    application_preference: this.props.application_preference,
    editors: this.props.editors,
    agents: this.props.agents,
    survey_link: this.props.survey_link,
    updateconfirmed: false,
    changed_academic: false,
    changed_application_preference: false,
    changed_language: false,
    res_status: 0,
    res_modal_status: 0,
    res_modal_message: ''
  };
  componentDidMount() {
    if (!this.props.student_id) {
      this.setState((state) => ({
        ...state,
        academic_background: this.props.academic_background,
        application_preference: this.props.application_preference,
        student_id: this.props.user._id
      }));
    }
  }
  componentDidUpdate(prevProps, prevState) {
    // 常見用法（別忘了比較 prop）：
    if (prevProps.student_id !== this.props.student_id) {
      this.setState((state) => ({
        ...state,
        student_id: this.props.student_id,
        editors: this.props.editors,
        agents: this.props.agents,
        academic_background: this.props.academic_background,
        application_preference: this.props.application_preference
      }));
    }
    if (
      prevProps.academic_background !== this.props.academic_background ||
      prevProps.application_preference !== this.props.application_preference
    ) {
      this.setState((state) => ({
        ...state,
        student_id: this.props.student_id,
        editors: this.props.editors,
        agents: this.props.agents,
        academic_background: this.props.academic_background,
        application_preference: this.props.application_preference,
        updateconfirmed: this.props.updateconfirmed
      }));
    }
  }

  handleSubmit_AcademicBackground = (e, university) => {
    e.preventDefault();
    updateAcademicBackground(university, this.state.student_id).then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        if (success) {
          this.setState((state) => ({
            ...state,
            // isLoaded: true,
            changed_academic: false,
            academic_background: {
              ...state.academic_background,
              university: data
            },
            success: success,
            updateconfirmed: true,
            res_modal_status: status
          }));
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

  handleSubmit_Language = (e, language) => {
    e.preventDefault();
    updateLanguageSkill(language, this.state.student_id).then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        if (success) {
          this.setState((state) => ({
            ...state,
            isLoaded: true,
            changed_language: true,
            academic_background: {
              ...state.academic_background,
              language: data
            },
            success: success,
            updateconfirmed: true,
            res_modal_status: status
          }));
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

  handleSubmit_ApplicationPreference = (e, application_preference) => {
    e.preventDefault();
    updateApplicationPreference(
      application_preference,
      this.state.student_id
    ).then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        if (success) {
          this.setState((state) => ({
            ...state,
            isLoaded: true,
            changed_application_preference: true,
            application_preference: data,
            success: success,
            updateconfirmed: true,
            res_modal_status: status
          }));
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

  onHide = () => {
    this.setState({
      updateconfirmed: false
    });
  };

  setmodalhide = () => {
    this.setState({
      updateconfirmed: false
    });
  };

  handleSubmit_AcademicBackground_root = (e, university) => {
    this.props.handleSubmit_AcademicBackground_root(
      e,
      university,
      this.state.student_id
    );
  };

  handleSubmit_Language_root = (e, language) => {
    this.props.handleSubmit_Language_root(e, language, this.state.student_id);
  };
  handleSubmit_ApplicationPreference_root = (e, application_preference) => {
    this.props.handleSubmit_ApplicationPreference_root(
      e,
      application_preference,
      this.state.student_id
    );
  };

  updateDocLink = (link, key) => {
    updateDocumentationHelperLink(link, key, 'survey').then(
      (resp) => {
        const { helper_link, success } = resp.data;
        const { status } = resp;
        if (success) {
          this.setState((state) => ({
            ...state,
            isLoaded: true,
            survey_link: helper_link,
            success: success,
            res_modal_status: status
          }));
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

  render() {
    const { res_status, isLoaded, res_modal_message, res_modal_status } =
      this.state;

    if (res_status >= 400) {
      return <ErrorPage res_status={res_status} />;
    }

    return (
      <Aux>
        {res_modal_status >= 400 && (
          <ModalMain
            ConfirmError={this.ConfirmError}
            res_modal_status={res_modal_status}
            res_modal_message={res_modal_message}
          />
        )}
        <SurveyEditableComponent
          academic_background={this.state.academic_background}
          application_preference={this.state.application_preference}
          agents={this.state.agents}
          editors={this.state.editors}
          user={this.props.user}
          student_id={this.state.student_id}
          handleSubmit_AcademicBackground={this.handleSubmit_AcademicBackground}
          handleSubmit_Language={this.handleSubmit_Language}
          handleSubmit_ApplicationPreference={
            this.handleSubmit_ApplicationPreference
          }
          singlestudentpage_fromtaiger={this.props.singlestudentpage_fromtaiger}
          handleSubmit_AcademicBackground_root={
            this.handleSubmit_AcademicBackground_root
          }
          handleSubmit_Language_root={this.handleSubmit_Language_root}
          handleSubmit_ApplicationPreference_root={
            this.handleSubmit_ApplicationPreference_root
          }
          updateDocLink={this.updateDocLink}
          survey_link={this.state.survey_link}
        />
        <Modal
          show={this.state.updateconfirmed}
          onHide={this.onHide}
          size="sm"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header>
            <Modal.Title id="contained-modal-title-vcenter">
              Update success
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Academic Background Surney is updated successfully!
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.setmodalhide}>Close</Button>
          </Modal.Footer>
        </Modal>
      </Aux>
    );
  }
}

export default SurveyComponent;
