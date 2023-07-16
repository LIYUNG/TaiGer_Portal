import React from 'react';
import { Spinner } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';

import Aux from '../../hoc/_Aux';
import NotesCard from './NotesCard';
import { spinner_style } from '../Utils/contants';
import { is_TaiGer_role } from '../Utils/checking-functions';
import ErrorPage from '../Utils/ErrorPage';

import { getStudentNotes } from '../../api';
import { TabTitle } from '../Utils/TabTitle';
import DEMO from '../../store/constant';

class Notes extends React.Component {
  state = {
    error: '',
    role: '',
    isLoaded: false,
    notes: '{}',
    success: false,
    academic_background: {},
    application_preference: {},
    updateconfirmed: false,
    res_status: 0
  };

  componentDidMount() {
    getStudentNotes(this.props.student_id).then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        let initialEditorState = null;
        if (data?.notes !== '{}') {
          try {
            initialEditorState = JSON.parse(data.notes);
          } catch (e) {
            initialEditorState = { time: new Date(), blocks: [] };
          }
        } else {
          initialEditorState = { time: new Date(), blocks: [] };
        }
        if (success) {
          this.setState({
            isLoaded: true,
            notes: initialEditorState,
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
    if (prevProps.student_id !== this.props.student_id) {
      getStudentNotes(this.props.student_id).then(
        (resp) => {
          const { data, success } = resp.data;
          var initialEditorState = null;
          if (data?.notes !== '{}') {
            try {
              initialEditorState = JSON.parse(data.notes);
            } catch (e) {
              initialEditorState = { time: new Date(), blocks: [] };
            }
          } else {
            initialEditorState = { time: new Date(), blocks: [] };
          }
          const { status } = resp;
          if (success) {
            this.setState({
              isLoaded: true,
              notes: initialEditorState,
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

  render() {
    if (!is_TaiGer_role(this.props.user)) {
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
        <NotesCard
          role={this.props.user.role}
          notes={this.state.notes}
          isLoaded={this.state.isLoaded}
          user={this.props.user}
          student_id={this.props.student_id}
        />
      </Aux>
    );
  }
}

export default Notes;
