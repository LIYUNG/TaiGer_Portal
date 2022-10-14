import React from 'react';
import { Row, Col, Spinner, Button, Card } from 'react-bootstrap';
import Aux from '../../hoc/_Aux';
import TimeOutErrors from '../Utils/TimeOutErrors';
import UnauthorizedError from '../Utils/UnauthorizedError';
import { getChecklists, updateChecklistStatus } from '../../api';
import {
  DataSheetGrid,
  checkboxColumn,
  textColumn,
  keyColumn
} from 'react-datasheet-grid';
import 'react-datasheet-grid/dist/style.css';
class MyCourses extends React.Component {
  state = {
    error: null,
    timeouterror: null,
    unauthorizederror: null,
    isLoaded: false,
    data: null,
    success: false,
    student: null,
    checklists: [],
    file: '',
    expand: true
  };

  componentDidMount() {
    getChecklists().then(
      (resp) => {
        const { data, success } = resp.data;
        if (success) {
          this.setState({
            isLoaded: true,
            checklists: data,
            student: this.props.user,
            success: success
          });
        } else {
          if (resp.status === 401 || resp.status === 500) {
            this.setState({ isLoaded: true, timeouterror: true });
          } else if (resp.status === 403) {
            this.setState({
              isLoaded: true,
              unauthorizederror: true
            });
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
  }

  handleClickChangeStatus = (e, student_id, item) => {
    e.preventDefault();
    // this.setState({
    //   isLoaded: false
    // });
    updateChecklistStatus(student_id, item).then(
      (resp) => {
        const { success, data } = resp.data;
        if (success) {
          this.setState({
            success,
            student: data,
            isLoaded: true
          });
        } else {
          if (resp.status === 401 || resp.status === 500) {
            this.setState({ isLoaded: true, timeouterror: true });
          } else if (resp.status === 403) {
            this.setState({ isLoaded: true, unauthorizederror: true });
          } else if (resp.status === 400) {
            this.setState({ isLoaded: true, pagenotfounderror: true });
          }
        }
      },
      (error) => {
        this.setState({ error });
      }
    );
  };

  render() {
    const data = [
      { active: true, firstName: 'Elon', lastName: 'Musk' },
      { active: false, firstName: 'Jeff', lastName: 'Bezos' }
    ];

    const columns = [
      { ...keyColumn('active', checkboxColumn), title: 'Active' },
      { ...keyColumn('firstName', textColumn), title: 'First name' },
      { ...keyColumn('lastName', textColumn), title: 'Last name' }
    ];
    const { unauthorizederror, timeouterror, isLoaded, accordionKeys } =
      this.state;
    const style = {
      position: 'fixed',
      top: '40%',
      left: '50%',
      transform: 'translate(-50%, -50%)'
    };
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
        <Row className="sticky-top ">
          <Col>
            <Card className="mb-2 mx-0" bg={'dark'} text={'light'}>
              <Card.Header text={'dark'}>
                <Card.Title>
                  <Row>
                    <Col className="my-0 mx-0 text-light">My Courses</Col>
                  </Row>
                </Card.Title>
              </Card.Header>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col sm={12}>
            <Card className="mb-2 mx-0">
              {/* <Card.Header>
                <Card.Title></Card.Title>
              </Card.Header> */}
              <Card.Body>
                <Row>Please fill the courses</Row>
                <DataSheetGrid
                  value={data}
                  // onChange={setData}
                  columns={columns}
                />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Aux>
    );
  }
}

export default MyCourses;
