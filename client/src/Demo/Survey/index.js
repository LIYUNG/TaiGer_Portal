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

class Survey extends React.Component {
  state = {
    error: null,
    role: '',
    isLoaded: false,
    data: null,
    success: false,
    academic_background: {},
    unauthorizederror: null,
    updateconfirmed: false
  };

  componentDidMount() {
    getMyAcademicBackground().then(
      (resp) => {
        const { data, success } = resp.data;
        if (success) {
          this.setState({
            isLoaded: true,
            academic_background: data,
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
    this.setState({ isLoaded: true });
  }

  handleChange_Academic = (e) => {
    e.preventDefault();
    var university_temp = { ...this.state.academic_background.university };
    university_temp[e.target.id] = e.target.value;
    this.setState((state) => ({
      ...state,
      academic_background: {
        ...state.academic_background,
        university: university_temp
      }
    }));
  };

  handleChange_Language = (e) => {
    e.preventDefault();
    var language_temp = { ...this.state.academic_background.language };
    language_temp[e.target.id] = e.target.value;
    this.setState((state) => ({
      ...state,
      academic_background: {
        ...state.academic_background,
        language: language_temp
      }
    }));
  };

  handleSubmit_AcademicBackground = (e, university) => {
    e.preventDefault();
    updateAcademicBackground(university).then(
      (resp) => {
        const { data, success } = resp.data;
        if (success) {
          this.setState((state) => ({
            ...state,
            isLoaded: true,
            academic_background: {
              ...state.academic_background,
              university: data
            },
            success: success,
            updateconfirmed: true
          }));
        } else {
          alert(resp.data.message);
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
    updateLanguageSkill(language).then(
      (resp) => {
        const { data, success } = resp.data;
        if (success) {
          this.setState((state) => ({
            ...state,
            isLoaded: true,
            academic_background: {
              ...state.academic_background,
              language: data
            },
            success: success,
            updateconfirmed: true
          }));
        } else {
          alert(resp.data.message);
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
  Bayerische_Formel = (high, low, my) => {
    if (high - low !== 0) {
      var Germen_note = 1 + (3 * (high - my)) / (high - low);
      return Germen_note.toFixed(2);
    }
    return 0;
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

  render() {
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
          isLoaded={this.state.isLoaded}
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
