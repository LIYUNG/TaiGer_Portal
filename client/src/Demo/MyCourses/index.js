import React from 'react';
import { Row, Col, Spinner, Button, Card } from 'react-bootstrap';
import Aux from '../../hoc/_Aux';
import CheckListItems from './CheckListItems';
import TimeOutErrors from '../Utils/TimeOutErrors';
import UnauthorizedError from '../Utils/UnauthorizedError';
import { getChecklists, updateChecklistStatus } from '../../api';
class CheckList extends React.Component {
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
    expand: true,
    accordionKeys:
      Object.keys(window.checklist) &&
      (this.props.user.role === 'Editor' || this.props.user.role === 'Agent')
        ? new Array(Object.keys(window.checklist).length)
            .fill()
            .map((x, i) => i)
        : [0] // to expand all]
  };

  componentDidMount() {
    const checklist = Object.keys(window.checklist);
    getChecklists().then(
      (resp) => {
        const { data, success } = resp.data;
        if (success) {
          this.setState({
            isLoaded: true,
            checklists: data,
            student: this.props.user,
            success: success,
            // accordionKeys: new Array(data.length).fill().map((x, i) => i), // to expand all
            accordionKeys: new Array(checklist.length).fill().map((x, i) => i) // to expand all
            // accordionKeys: new Array(-1, data.length) // to collapse all
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
    // this.setState({
    //   isLoaded: true,

    //   accordionKeys: new Array(checklist.length).fill().map((x, i) => i) // to expand all
    //   //   accordionKeys: new Array(-1, data.length), // to collapse all
    // });
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
    const checklist = Object.keys(window.checklist);
    this.setState((state) => ({
      ...state,
      expand: false,
      accordionKeys:
        checklist &&
        (this.props.user.role === 'Editor' || this.props.user.role === 'Agent')
          ? new Array(checklist.length).fill().map((x, i) => -1)
          : [-1] // to expand all]
    }));
  };
  AllExpandtHandler = () => {
    const checklist = Object.keys(window.checklist);
    this.setState((state) => ({
      ...state,
      expand: true,
      accordionKeys:
        checklist && new Array(checklist.length).fill().map((x, i) => i)
      // to expand all]
    }));
  };

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

    const checklist = Object.keys(window.checklist);
    const student_editor = checklist.map((item, i) => (
      <Card className="mb-2 mx-0" key={i}>
        <Card.Header onClick={() => this.singleExpandtHandler(i)}>
          <Card.Title
            aria-controls={'accordion' + i}
            aria-expanded={this.state.accordionKeys[i] === i}
          >
            {this.props.user.role === 'Student' &&
              this.props.user.checklist[item].name}
            {window.checklist[item]}
          </Card.Title>
        </Card.Header>
        <CheckListItems
          idx={i}
          name={
            this.state.checklists.find(
              (checklist) => checklist.prop === item
            ) &&
            this.state.checklists.find((checklist) => checklist.prop === item)
              .name
          } // TODO
          item={item} // TODO
          message={
            this.state.checklists.find(
              (checklist) => checklist.prop === item
            ) &&
            this.state.checklists.find((checklist) => checklist.prop === item)
              .text
          } // TODO
          accordionKeys={this.state.accordionKeys}
          singleExpandtHandler={this.singleExpandtHandler}
          role={this.props.user.role}
          student={this.state.student}
          handleClickChangeStatus={this.handleClickChangeStatus}
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
                    <Col className="my-0 mx-0 text-light">Check List</Col>
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

export default CheckList;
