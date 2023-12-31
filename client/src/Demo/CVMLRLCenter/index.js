import React from 'react';
import { Row, Col, Spinner, Card } from 'react-bootstrap';

import Aux from '../../hoc/_Aux';
import CVMLRLOverview from './CVMLRLOverview';
import { spinner_style } from '../Utils/contants';
import ErrorPage from '../Utils/ErrorPage';

import { getCVMLRLOverview } from '../../api';
import { TabTitle } from '../Utils/TabTitle';
import { is_TaiGer_role } from '../Utils/checking-functions';
import { Link } from 'react-router-dom';
import DEMO from '../../store/constant';
import { TopBar } from '../../components/TopBar/TopBar';

class index extends React.Component {
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
    getCVMLRLOverview().then(
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
    const { res_status, isLoaded } = this.state;
    TabTitle('CV ML RL Center');
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
        <TopBar>CV ML RL Overview</TopBar>
        {!is_TaiGer_role(this.props.user) && (
          <Card>
            <Card.Body>
              <h5>Instructions</h5>
              若您為初次使用，可能無任何
              Tasks。請聯絡您的顧問處理選校等，方能開始準備文件。
              <br />
              在此之前可以詳閱，了解之後與Editor之間的互動模式：
              <Link to={`${DEMO.CV_ML_RL_DOCS_LINK}`} target="_blank">
                <b className="text-info">Click me</b>
              </Link>
            </Card.Body>
          </Card>
        )}
        <CVMLRLOverview
          isLoaded={this.state.isLoaded}
          success={this.state.success}
          students={this.state.students}
          user={this.props.user}
        />
      </Aux>
    );
  }
}

export default index;
