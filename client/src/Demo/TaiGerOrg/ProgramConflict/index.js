import React from 'react';
import { Spinner } from 'react-bootstrap';

import Aux from '../../../hoc/_Aux';
import { TabTitle } from '../../Utils/TabTitle';
import TabProgramConflict from '../../Dashboard/MainViewTab/ProgramConflict/TabProgramConflict';
import ErrorPage from '../../Utils/ErrorPage';
import ModalMain from '../../Utils/ModalHandler/ModalMain';
import { SYMBOL_EXPLANATION, spinner_style } from '../../Utils/contants';

import { getAllCVMLRLOverview, getAllStudents } from '../../../api';

class Dashboard extends React.Component {
  state = {
    error: '',
    agent_list: [],
    editor_list: [],
    isLoaded: false,
    students: [],
    updateAgentList: {},
    updateEditorList: {},
    success: false,
    isDashboard: true,
    file: '',
    res_status: 0,
    res_modal_message: '',
    res_modal_status: 0
  };

  componentDidMount() {
    getAllCVMLRLOverview().then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        if (success) {
          this.setState({
            isLoaded: true,
            students: data,
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

  ConfirmError = () => {
    this.setState((state) => ({
      ...state,
      res_modal_status: 0,
      res_modal_message: ''
    }));
  };

  render() {
    const { res_modal_status, res_modal_message, isLoaded, res_status } =
      this.state;
    TabTitle('Home Page');
    if (!isLoaded || !this.state.students) {
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
        {res_modal_status >= 400 && (
          <ModalMain
            ConfirmError={this.ConfirmError}
            res_modal_status={res_modal_status}
            res_modal_message={res_modal_message}
          />
        )}
        <TabProgramConflict students={this.state.students} />
      </Aux>
    );
  }
}

export default Dashboard;
