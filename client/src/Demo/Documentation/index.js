import React from 'react';
import { Row, Col, Spinner, Button, Card } from 'react-bootstrap';
import Aux from '../../hoc/_Aux';
import DocumentsListItems from './DocumentsListItems';
import TimeOutErrors from '../Utils/TimeOutErrors';
import UnauthorizedError from '../Utils/UnauthorizedError';
import { getCategorizedDocumentation, updateChecklistStatus } from '../../api';
class CheckList extends React.Component {
  state = {
    error: null,
    timeouterror: null,
    unauthorizederror: null,
    isLoaded: false,
    data: null,
    success: false,
    student: null,
    documentlists: [],
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
    getCategorizedDocumentation(this.props.match.params.category).then(
      (resp) => {
        const { data, success } = resp.data;
        if (success) {
          this.setState({
            isLoaded: true,
            documentlists: data,
            student: this.props.user,
            success: success
            // accordionKeys: new Array(data.length).fill().map((x, i) => i), // to expand all
            // accordionKeys: new Array(checklist.length).fill().map((x, i) => i) // to expand all
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
  handleClickAdd = (e) => {
    e.preventDefault();
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

    const document_list = this.state.documentlists.map((item, i) => (
      <DocumentsListItems
        idx={i}
        key={i}
        name={
          this.state.documentlists.find(
            (checklist) => checklist.prop === item
          ) &&
          this.state.documentlists.find((checklist) => checklist.prop === item)
            .name
        } // TODO
        item={item} // TODO
        message={
          this.state.documentlists.find(
            (checklist) => checklist.prop === item
          ) &&
          this.state.documentlists.find((checklist) => checklist.prop === item)
            .text
        } // TODO
        accordionKeys={this.state.accordionKeys}
        singleExpandtHandler={this.singleExpandtHandler}
        role={this.props.user.role}
      />
    ));

    return (
      <Aux>
        <Row className="sticky-top ">
          <Col>
            <Card className="mb-2 mx-0" bg={'dark'} text={'light'}>
              <Card.Header text={'dark'}>
                <Card.Title>
                  <Row>
                    <Col className="my-0 mx-0 text-light">
                      Application Instruction
                    </Col>
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
          <Col sm={12}>
            <Card className="mb-2 mx-0">
              {document_list}
              {(this.props.user.role === 'Admin' ||
                this.props.user.role === 'Agent') && (
                <Button onClick={(e) => this.handleClickAdd(e)}>Add</Button>
              )}
            </Card>
          </Col>
        </Row>
      </Aux>
    );
  }
}

export default CheckList;
