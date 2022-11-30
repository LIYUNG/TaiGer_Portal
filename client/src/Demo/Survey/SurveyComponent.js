import React from 'react';
import { Row, Col, Card, Form, Button, Spinner, Modal } from 'react-bootstrap';

import Aux from '../../hoc/_Aux';
import {
  updateAcademicBackground,
  updateLanguageSkill,
  updateApplicationPreference
} from '../../api';
import { convertDate } from '../Utils/contants';
import TimeOutErrors from '../Utils/TimeOutErrors';
import UnauthorizedError from '../Utils/UnauthorizedError';
import SurveyEditableComponent from './SurveyEditableComponent';
class SurveyComponent extends React.Component {
  state = {
    error: null,
    timeouterror: null,
    unauthorizederror: null,
    role: '',
    isLoaded: this.props.isLoaded,
    student_id: this.props.student_id,
    success: false,
    academic_background: this.props.academic_background,
    application_preference: this.props.application_preference,
    updateconfirmed: false,
    changed_academic: false,
    changed_application_preference: false,
    changed_language: false
  };
  componentDidMount() {
    if (!this.props.student_id) {
      this.setState((state) => ({
        ...state,
        academic_background: this.props.academic_background,
        student_id: this.props.user._id
      }));
    }
  }
  componentDidUpdate(prevProps) {
    // 常見用法（別忘了比較 prop）：
    if (prevProps.academic_background !== this.props.academic_background) {
      this.setState((state) => ({
        ...state,
        academic_background: this.props.academic_background,
        updateconfirmed: this.props.updateconfirmed
      }));
    }
  }

  handleSubmit_AcademicBackground = (e, university) => {
    e.preventDefault();
    updateAcademicBackground(university, this.state.student_id).then(
      (resp) => {
        const { data, success } = resp.data;
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
            updateconfirmed: true
          }));
        } else {
          if (resp.status === 401 || resp.status === 500) {
            this.setState({ isLoaded: true, timeouterror: true });
          } else if (resp.status === 403) {
            this.setState({ isLoaded: true, unauthorizederror: true });
          }
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

  handleSubmit_Language = (e, language) => {
    e.preventDefault();
    updateLanguageSkill(language, this.state.student_id).then(
      (resp) => {
        const { data, success } = resp.data;
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
            updateconfirmed: true
          }));
        } else {
          if (resp.status === 401 || resp.status === 500) {
            this.setState({ isLoaded: true, timeouterror: true });
          } else if (resp.status === 403) {
            this.setState({ isLoaded: true, unauthorizederror: true });
          }
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

  handleSubmit_ApplicationPreference = (e, application_preference) => {
    e.preventDefault();
    updateApplicationPreference(
      application_preference,
      this.state.student_id
    ).then(
      (resp) => {
        const { data, success } = resp.data;
        if (success) {
          this.setState((state) => ({
            ...state,
            isLoaded: true,
            changed_application_preference: true,
            application_preference: data,
            success: success,
            updateconfirmed: true
          }));
        } else {
          if (resp.status === 401 || resp.status === 500) {
            this.setState({ isLoaded: true, timeouterror: true });
          } else if (resp.status === 403) {
            this.setState({ isLoaded: true, unauthorizederror: true });
          }
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

  render() {
    const { unauthorizederror, timeouterror, isLoaded } = this.state;

    if (timeouterror) {
      return (
        <div>
          <TimeOutErrors />
        </div>
      );
    }
    if (unauthorizederror) {
      return (
        <div>
          <UnauthorizedError />
        </div>
      );
    }

    return (
      <Aux>
        <SurveyEditableComponent
          academic_background={this.state.academic_background}
          application_preference={this.state.application_preference}
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
