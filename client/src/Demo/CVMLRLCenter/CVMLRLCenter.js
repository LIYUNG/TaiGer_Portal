import React from 'react';
import { Row, Col, Spinner, Button, Card } from 'react-bootstrap';
import Aux from '../../hoc/_Aux';
import DEMO from '../../store/constant';
import { getCVMLRLOverview } from '../../api';
import EditorDocsProgress from './EditorDocsProgress';
import ManualFiles from './ManualFiles';

class EditorCenter extends React.Component {
  state = {
    error: null,
    isLoaded: false,
    data: null,
    success: false,
    // accordionKeys: new Array(-1, this.props.user.students.length),  // To collapse all
    students: [],
    file: '',
    expand: true,
    accordionKeys:
      this.props.user.role === 'Editor' || this.props.user.role === 'Agent'
        ? new Array(this.props.user.students.length).fill().map((x, i) => i)
        : [0] // to expand all]
  };

  componentDidMount() {
    console.log(this.props.user);
    getCVMLRLOverview().then(
      (resp) => {
        console.log(resp.data);
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
          alert(resp.data.message);
        }
      },
      (error) => {
        console.log(error);
        console.log(': ' + error);
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
        this.props.user.role === 'Editor' || this.props.user.role === 'Agent'
          ? new Array(this.props.user.students.length).fill().map((x, i) => -1)
          : [-1] // to expand all]
    }));
  };
  AllExpandtHandler = () => {
    this.setState((state) => ({
      ...state,
      expand: true,
      accordionKeys:
        this.props.user.role === 'Editor' || this.props.user.role === 'Agent'
          ? new Array(this.props.user.students.length).fill().map((x, i) => i)
          : [0] // to expand all]
    }));
  };

  render() {
    const { error, isLoaded, accordionKeys } = this.state;
    const style = {
      position: 'fixed',
      top: '40%',
      left: '50%',
      transform: 'translate(-50%, -50%)'
    };
    if (error) {
      return (
        <div>
          Error: your session is timeout! Please refresh the page and Login
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
      <>
        <Card className="mt-2" key={i}>
          <Card.Header
            onClick={() => this.singleExpandtHandler(i)}
          >
            <Card.Title
              as="h5"
              aria-controls={'accordion' + i}
              aria-expanded={
                this.state.accordionKeys[i] === i
              }
            >
              {student.firstname}
              {' ,'}
              {student.lastname}
            </Card.Title>
          </Card.Header>
          <EditorDocsProgress
            key={i}
            idx={i}
            student={student}
            accordionKeys={this.state.accordionKeys}
            singleExpandtHandler={this.singleExpandtHandler}
            role={this.props.user.role}
          />
        </Card>
      </>
    ));

    return (
      <Aux>
        <Row className="sticky-top ">
          <Card className="mt-0">
            <Card.Header>
              <Card.Title as="h5">
                <Row>
                  <Col>
                    <h4>CV/ML/RL Center</h4>
                  </Col>
                  <Col md={{ span: 2, offset: 0 }}>
                    {this.state.expand ? (
                      <Button
                        className="btn-sm"
                        onClick={() => this.AllCollapsetHandler()}
                      >
                        Collaspse
                      </Button>
                    ) : (
                      <Button
                        className="btn-sm"
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
        </Row>
        <Row>
          <Col sm={12}>{student_editor}</Col>
        </Row>
      </Aux>
    );
  }
}

export default EditorCenter;
