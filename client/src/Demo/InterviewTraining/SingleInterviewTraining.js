import React from 'react';
import { Spinner } from 'react-bootstrap';

import Aux from '../../hoc/_Aux';
import { spinner_style } from '../Utils/contants';
import ErrorPage from '../Utils/ErrorPage';

import {
  getInterview,
  updateAcademicBackground,
  updateLanguageSkill
} from '../../api';

class SingleInterviewTraining extends React.Component {
  state = {
    error: null,
    role: '',
    isLoaded: false,
    data: null,
    success: false,
    academic_background: {},
    updateconfirmed: false,
    res_status: 0
  };

  componentDidMount() {
    getInterview(this.props.match.params.interview_id).then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        if (success) {
          this.setState({
            isLoaded: true,
            academic_background: data,
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
        const { status } = resp;
        if (success) {
          this.setState((state) => ({
            ...state,
            isLoaded: true,
            academic_background: {
              ...state.academic_background,
              university: data
            },
            success: success,
            updateconfirmed: true,
            res_status: status
          }));
        } else {
          this.setState({
            isLoaded: true,
            res_status: status
          });
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
        const { status } = resp;
        if (success) {
          this.setState((state) => ({
            ...state,
            isLoaded: true,
            academic_background: {
              ...state.academic_background,
              language: data
            },
            success: success,
            updateconfirmed: true,
            res_status: status
          }));
        } else {
          this.setState({
            isLoaded: true,
            res_status: status
          });
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
    const { error, spinner_style, isLoaded } = this.state;
    const style = {
      position: 'fixed',
      top: '40%',
      left: '50%',
      transform: 'translate(-50%, -50%)'
    };

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
        {this.props.user.role === 'Student' && <>Book interview</>}
        {this.props.user.role === 'Editor' && <>Interview Training page</>}
      </Aux>
    );
  }
}

export default SingleInterviewTraining;
