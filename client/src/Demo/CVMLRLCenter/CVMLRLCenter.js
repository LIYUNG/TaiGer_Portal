import React from 'react';
import { Row, Col, Spinner, Button, Card } from 'react-bootstrap';
import Aux from '../../hoc/_Aux';
import DEMO from '../../store/constant';
import { getCVMLRLOverview } from '../../api';
import EditorDocsProgress from './EditorDocsProgress';
import TimeOutErrors from '../Utils/TimeOutErrors';
import UnauthorizedError from '../Utils/UnauthorizedError';
import { Link } from 'react-router-dom';

class CVMLRLCenter extends React.Component {
  state = {
    error: null,
    timeouterror: null,
    unauthorizederror: null,
    isLoaded: false,
    data: null,
    success: false,
    // accordionKeys: new Array(-1, this.props.user.students.length),  // To collapse all
    students: [],
    file: '',
    expand: true,
    accordionKeys:
      this.props.user.students &&
      (this.props.user.role === 'Editor' || this.props.user.role === 'Agent')
        ? new Array(this.props.user.students.length).fill().map((x, i) => i)
        : [0] // to expand all]
  };

  componentDidMount() {
    getCVMLRLOverview().then(
      (resp) => {
        const { data, success } = resp.data;
        if (success) {
          this.setState({
            isLoaded: true,
            students: data,
            success: success,
            accordionKeys: new Array(data.length).fill().map((x, i) => i) // to expand all
            //   accordionKeys: new Array(-1, data.length), // to collapse all
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
  }

  singleExpandtHandler = (idx) => {
    let accordionKeys = [...this.state.accordionKeys];
    accordionKeys[idx] = accordionKeys[idx] !== idx ? idx : -1;
    this.setState((state) => ({
      ...state,
      accordionKeys: accordionKeys
    }));
  };
  AllCollapsetHandler = () => {
    this.setState((state) => ({
      ...state,
      expand: false,
      accordionKeys:
        this.props.user.students &&
        (this.props.user.role === 'Editor' || this.props.user.role === 'Agent')
          ? new Array(this.props.user.students.length).fill().map((x, i) => -1)
          : [-1] // to expand all]
    }));
  };
  AllExpandtHandler = () => {
    this.setState((state) => ({
      ...state,
      expand: true,
      accordionKeys:
        this.props.user.students &&
        (this.props.user.role === 'Editor' || this.props.user.role === 'Agent')
          ? new Array(this.props.user.students.length).fill().map((x, i) => i)
          : [0] // to expand all]
    }));
  };

  render() {
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

    const student_editor = this.state.students.map((student, i) => (
      <Card className="mb-2 mx-0" bg={'dark'} text={'light'} key={i}>
        <Card.Header onClick={() => this.singleExpandtHandler(i)}>
          <Card.Title
            aria-controls={'accordion' + i}
            aria-expanded={this.state.accordionKeys[i] === i}
          >
            <Link
              to={'/student-database/' + student._id + '/CV_ML_RL'}
              style={{ textDecoration: 'none' }}
              className="text-info"
            >
              {student.firstname}
              {' ,'}
              {student.lastname}
            </Link>
          </Card.Title>
        </Card.Header>
        <EditorDocsProgress
          idx={i}
          student={student}
          accordionKeys={this.state.accordionKeys}
          singleExpandtHandler={this.singleExpandtHandler}
          role={this.props.user.role}
        />
      </Card>
    ));

    return (
      <Aux>
        <Row className="sticky-top ">
          <Col>
            <Card className="mb-2 mx-0" bg={'dark'} text={'light'}>
              <Card.Header text={'dark'}>
                <Card.Title>
                  <Row>
                    <Col>CV/ML/RL Center</Col>
                    <Col md={{ span: 2, offset: 0 }}>
                      {this.state.expand ? (
                        <Button
                          size="sm"
                          onClick={() => this.AllCollapsetHandler()}
                        >
                          Collaspse
                        </Button>
                      ) : (
                        <Button
                          size={'sm'}
                          onClick={() => this.AllExpandtHandler()}
                        >
                          Expand
                        </Button>
                      )}
                    </Col>
                  </Row>
                </Card.Title>
              </Card.Header>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col sm={12}>{student_editor}</Col>
        </Row>
      </Aux>
    );
  }
}

export default CVMLRLCenter;
