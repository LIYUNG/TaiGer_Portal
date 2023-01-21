import React from 'react';
import { Spinner } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';

import Aux from '../../hoc/_Aux';
import SurveyComponent from './SurveyComponent';
import { profile_name_list, spinner_style } from '../Utils/contants';
import { is_TaiGer_role } from '../Utils/checking-functions';
import ErrorPage from '../Utils/ErrorPage';

import { getMyAcademicBackground } from '../../api';
import { TabTitle } from '../Utils/TabTitle';
import DEMO from '../../store/constant';

class Survey extends React.Component {
  state = {
    error: '',
    role: '',
    isLoaded: false,
    data: null,
    success: false,
    academic_background: {},
    application_preference: {},
    updateconfirmed: false,
    res_status: 0
  };

  componentDidMount() {
    getMyAcademicBackground().then(
      (resp) => {
        const { survey_link, data, success } = resp.data;
        const { status } = resp;
        if (success) {
          const granding_system_doc_link = survey_link.find(
            (link) => link.key === profile_name_list.Grading_System
          );
          this.setState({
            isLoaded: true,
            agents: data.agents,
            editors: data.editors,
            academic_background: data.academic_background,
            application_preference: data.application_preference,
            survey_link: granding_system_doc_link.link,
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

  render() {
    if (is_TaiGer_role(this.props.user)) {
      return <Redirect to={`${DEMO.DASHBOARD_LINK}`} />;
    }
    TabTitle('Academic Background Survey');
    const { res_status, isLoaded } = this.state;

    if (!isLoaded) {
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

    return (
      <Aux>
        <SurveyComponent
          role={this.props.user.role}
          academic_background={this.state.academic_background}
          application_preference={this.state.application_preference}
          agents={this.state.agents}
          editors={this.state.editors}
          survey_link={this.state.survey_link}
          isLoaded={this.state.isLoaded}
          user={this.props.user}
        />

        {!isLoaded && (
          <div style={spinner_style}>
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
