import React from 'react';
import { Row, Col, Card, Form, Button, Spinner, Modal } from 'react-bootstrap';

import Aux from '../../hoc/_Aux';
import { updateAcademicBackground, updateLanguageSkill } from '../../api';
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
    updateconfirmed: false,
    changed_academic: false,
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
        academic_background: this.props.academic_background
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
          if (resp.status === 401) {
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
    updateLanguageSkill(language, this.props.student_id).then(
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
          if (resp.status === 401) {
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
  check_survey_filled = (academic_background) => {
    if (!academic_background || !academic_background.university) {
      return false;
    }
    if (
      !academic_background.university.expected_application_date ||
      !academic_background.university.expected_application_semester
    ) {
      return false;
    }
    return true;
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
    const style = {
      position: 'fixed',
      top: '40%',
      left: '50%',
      transform: 'translate(-50%, -50%)'
    };

    // if (!isLoaded) {
    //   return (
    //     <div style={style}>
    //       <Spinner animation="border" role="status">
    //         <span className="visually-hidden"></span>
    //       </Spinner>
    //     </div>
    //   );
    // }
    return (
      <Aux>
        <SurveyEditableComponent
          academic_background={this.state.academic_background}
          user={this.props.user}
          student_id={this.state.student_id}
          handleSubmit_AcademicBackground={this.handleSubmit_AcademicBackground}
          handleSubmit_Language={this.handleSubmit_Language}
        />{' '}
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
