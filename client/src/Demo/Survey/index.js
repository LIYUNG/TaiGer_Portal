import React from 'react';
import { Spinner } from 'react-bootstrap';

import Aux from '../../hoc/_Aux';
import {
  getMyAcademicBackground,
  updateAcademicBackground,
  updateLanguageSkill
} from '../../api';
import SurveyComponent from './SurveyComponent';
import TimeOutErrors from '../Utils/TimeOutErrors';
import UnauthorizedError from '../Utils/UnauthorizedError';
import { Redirect } from 'react-router-dom';
import { profile_name_list } from '../Utils/contants';

class Survey extends React.Component {
  state = {
    error: null,
    role: '',
    isLoaded: false,
    data: null,
    success: false,
    academic_background: {},
    application_preference: {},
    unauthorizederror: null,
    updateconfirmed: false
  };

  componentDidMount() {
    getMyAcademicBackground().then(
      (resp) => {
        const { survey_link, data, success } = resp.data;
        const granding_system_doc_link = survey_link.find(
          (link) => link.key === profile_name_list.Grading_System
        );
        if (success) {
          this.setState({
            isLoaded: true,
            academic_background: data.academic_background,
            application_preference: data.application_preference,
            survey_link: granding_system_doc_link.link,
            success: success
          });
        } else {
          if (resp.status == 401) {
            this.setState({ isLoaded: true, timeouterror: true });
          } else if (resp.status == 403) {
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
    // this.setState({ isLoaded: true });
  }

  render() {
    if (
      this.props.user.role !== 'Student' &&
      this.props.user.role !== 'Guest'
    ) {
      return <Redirect to="/dashboard/default" />;
    }
    const { timeouterror, unauthorizederror, isLoaded } = this.state;

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

    if (!isLoaded) {
      return (
        <div style={style}>
          <Spinner animation="border" role="status">
            <span className="visually-hidden"></span>
          </Spinner>
        </div>
      );
    }
    return (
      <Aux>
        <SurveyComponent
          role={this.props.user.role}
          academic_background={this.state.academic_background}
          application_preference={this.state.application_preference}
          survey_link={this.state.survey_link}
          isLoaded={this.state.isLoaded}
          user={this.props.user}
        />

        {!isLoaded && (
          <div style={style}>
            <Spinner animation="border" role="status">
              <span className="visually-hidden"></span>
            </Spinner>
          </div>
        )}
      </Aux>
    );
  }
}

export default Survey;
