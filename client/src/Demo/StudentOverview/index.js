import React from 'react';
import { Spinner } from 'react-bootstrap';

import Aux from '../../hoc/_Aux';
import { spinner_style } from '../Utils/contants';
import ErrorPage from '../Utils/ErrorPage';

import { getAllActiveStudents } from '../../api';
import { TabTitle } from '../Utils/TabTitle';
import { is_TaiGer_role } from '../Utils/checking-functions';
import { Redirect } from 'react-router-dom';
import DEMO from '../../store/constant';
import StudentOverviewTable from '../../components/StudentOverviewTable';
import { TopBar } from '../../components/TopBar/TopBar';

class StudentOverviewPage extends React.Component {
  state = {
    error: '',
    isLoaded: false,
    data: null,
    success: false,
    students: null,
    doc_thread_id: '',
    student_id: '',
    program_id: '',
    SetAsFinalFileModel: false,
    isFinalVersion: false,
    status: '', //reject, accept... etc
    res_status: 0,
    res_modal_message: '',
    res_modal_status: 0
  };

  componentDidMount() {
    getAllActiveStudents().then(
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

  render() {
    if (!is_TaiGer_role(this.props.user)) {
      return <Redirect to={`${DEMO.DASHBOARD_LINK}`} />;
    }
    const { res_status, isLoaded } = this.state;
    TabTitle('Students Overview');
    if (!isLoaded && !this.state.students) {
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
        <TopBar>
          All Active Student Overview ({this.state.students?.length})
        </TopBar>
        <StudentOverviewTable
          title="All"
          students={this.state.students}
          user={this.props.user}
        />
      </Aux>
    );
  }
}

export default StudentOverviewPage;
