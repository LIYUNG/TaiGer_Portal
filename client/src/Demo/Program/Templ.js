import React from 'react';
import {
  Button,
  Table,
  Row,
  Col,
  ButtonToolbar,
  DropdownButton,
  Dropdown,
  Spinner,
  Card
} from 'react-bootstrap';
// import Card from '../../App/components/MainCard';

import ProgramListSubpage from './ProgramListSubpage';
import ProgramDeleteWarning from './ProgramDeleteWarning';
import ProgramAddedMyWatchList from './ProgramAddedMyWatchList';
import Program from './Program';
import NewProgramEdit from './NewProgramEdit';
import UnauthorizedError from '../Utils/UnauthorizedError';
import TimeOutErrors from '../Utils/TimeOutErrors';

import {
  getPrograms,
  createProgram,
  deleteProgram,
  assignProgramToStudent
} from '../../api';
class Programlist extends React.Component {
  state = {
    error: null,
    role: '',
    isLoaded: false,
    data: null,
    programs: null,
    success: false,
    modalShow: false,
    uni_name: '',
    program_name: '',
    program_id: '',
    modalShowNAddMyWatchList: false,
    deleteProgramWarning: false,
    StudentId: '',
    newProgramPage: false,
    programs_id_set: [],
    unauthorizederror: null
  };

  componentDidMount() {
    getPrograms().then(
      (resp) => {
        const { data, success } = resp.data;
        if (success) {
          this.setState({
            isLoaded: true,
            programs: data,
            success
          });
        } else {
          if (resp.status == 401) {
            this.setState({ isLoaded: true, error: true });
          } else if (resp.status == 403) {
            this.setState({ isLoaded: true, unauthorizederror: true });
          }
        }
      },
      (error) => this.setState({ isLoaded: true, error })
    );
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.isLoaded === false) {
      getPrograms().then(
        (resp) => {
          const { data, success } = resp.data;
          if (success) {
            this.setState({
              isLoaded: true,
              programs: data,
              success
            });
          } else {
            if (resp.status == 401) {
              this.setState({ isLoaded: true, error: true });
            } else if (resp.status == 403) {
              this.setState({ isLoaded: true, unauthorizederror: true });
            }
          }
        },
        (error) => this.setState({ isLoaded: true, error })
      );
    }
  }

  handleChange2 = (e) => {
    const { value } = e.target;
    this.setState((state) => ({
      StudentId: value
    }));
  };

  assignProgram = (assign_data) => {
    const { student_id, program_ids } = assign_data;
    assignProgramToStudent(student_id, program_ids).then(
      (resp) => {
        const { success } = resp.data;
        if (success) {
          this.setState({
            isLoaded: true,
            success
          });
        } else {
          alert(resp.data.message);
        }
      },
      (error) => {}
    );
  };

  onSubmitAddToStudentProgramList = (e) => {
    e.preventDefault();
    const student_id = this.state.StudentId;
    this.assignProgram({ student_id, program_ids: this.state.programs_id_set });
    this.setState({
      modalShow: false
    });
  };

  onSubmitAddToMyProgramList = (e, UserId) => {
    const student_id = UserId;
    this.assignProgram({ student_id, program_ids: this.state.programs_id_set });
    this.setState({
      modalShowNAddMyWatchList: true
    });
  };

  setModalShow = () => {
    this.setState({
      modalShow: true
    });
  };

  setModalHide = () => {
    this.setState({
      modalShow: false
    });
  };

  setModalShowDelete = (uni_name, program_name, programID) => {
    this.setState({
      deleteProgramWarning: true,
      uni_name: uni_name,
      program_name: program_name,
      program_id: programID
    });
  };

  setModalHideDDelete = () => {
    this.setState({
      deleteProgramWarning: false
    });
  };

  NewProgram = () => {
    this.setState({
      newProgramPage: true
    });
  };

  setModalShow_AddToMyWatchList = () => {
    this.setState({
      modalShowNAddMyWatchList: true
    });
  };
  setModalHide_AddToMyWatchList = () => {
    this.setState({
      modalShowNAddMyWatchList: false
    });
  };

  handleSubmit_Program = (program) => {
    createProgram(program).then(
      (resp) => {
        const { data, success } = resp.data;
        if (success) {
          this.setState({
            isLoaded: true,
            programs: this.state.programs.concat(data),
            success: success,
            newProgramPage: !this.state.newProgramPage
          });
        } else {
          alert(resp.data.message);
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

  deleteProgram = (program_id) => {
    deleteProgram(program_id).then(
      (resp) => {},
      (error) => {
        this.setState({
          isLoaded: true,
          error
        });
      }
    );
  };

  RemoveProgramHandler3 = (program_id) => {
    this.setState({
      programs: this.state.programs.filter(
        (program) => program._id !== program_id
      )
    });
    this.deleteProgram(program_id);
    this.setState({
      isLoaded: false
    });
  };

  handleClick = () => {
    this.setState((state) => ({
      ...state,
      newProgramPage: !this.state.newProgramPage
    }));
  };
  selectPrograms = (e) => {
    // e.preventDefault();
    var program_id_local = e.target.id;
    var programs_id_set_local = [...this.state.programs_id_set];
    if (e.target.checked) {
      programs_id_set_local.push(program_id_local);
    } else {
      var index = programs_id_set_local.indexOf(program_id_local);
      if (index > -1) {
        programs_id_set_local.splice(index, 1);
      }
    }
    this.setState((state) => ({
      ...state,
      programs_id_set: programs_id_set_local
    }));
  };
  render() {
    const { unauthorizederror, error, isLoaded } = this.state;
    const style = {
      position: 'fixed',
      top: '40%',
      left: '50%',
      transform: 'translate(-50%, -50%)'
    };
    if (error) {
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
    if (!isLoaded && !this.state.programs) {
      return (
        <div style={style}>
          <Spinner animation="border" role="status">
            <span className="visually-hidden"></span>
          </Spinner>
        </div>
      );
    }

    const headers = (
      <tr>
        <th> </th>
        {window.ProgramlistHeader.map((x, i) => (
          <th key={i}>{x.name}</th>
        ))}
      </tr>
    );

    const programs = this.state.programs.map((program) => (
      <Program
        key={program._id}
        success={this.state.success}
        role={this.props.role}
        userId={this.props.userId}
        program={program}
        setModalShowDelete={this.setModalShowDelete}
        RemoveProgramHandler3={this.RemoveProgramHandler3}
        selectPrograms={this.selectPrograms}
      />
    ));
    if (this.state.newProgramPage) {
      return (
        <>
          <NewProgramEdit
            handleClick={this.handleClick}
            handleSubmit_Program={this.handleSubmit_Program}
          />
        </>
      );
    } else {
      return (
        <>
          <Card>
            <Card.Header>
              <Card.Title>
                <Row>
                  <Col md={11}> Program List</Col>
                  <Col md={1}>
                    {this.props.role === 'Student' ? (
                      <></>
                    ) : (
                      <Button
                        className="btn btn-primary"
                        type="submit"
                        size="sm"
                        onClick={() => this.NewProgram()}
                      >
                        Add
                      </Button>
                    )}
                  </Col>
                </Row>
              </Card.Title>
            </Card.Header>
          </Card>
          <Card>
            <Card.Body></Card.Body>
          </Card>
          <Row>
            <Col md={6}>
              {this.state.programs_id_set.length !== 0 && (
                <>
                  {this.props.role === 'Student' ? (
                    <DropdownButton size="sm" title="Option" variant="primary">
                      <Dropdown.Item
                        eventKey="2"
                        onClick={(e) =>
                          this.onSubmitAddToMyProgramList(e, this.props.userId)
                        }
                      >
                        Add to my watch list
                      </Dropdown.Item>
                    </DropdownButton>
                  ) : (
                    <DropdownButton size="sm" title="Option" variant="primary">
                      <Dropdown.Item eventKey="2" onClick={this.setModalShow}>
                        Assign to student...
                      </Dropdown.Item>
                      {/* <Dropdown.Item
                  eventKey="3"
                  onClick={() =>
                    this.props.setModalShowDelete(
                      this.props.program.school,
                      this.props.program.program_name,
                      this.props.program._id
                    )
                  }
                >
                  Delete
                </Dropdown.Item> */}
                    </DropdownButton>
                  )}
                </>
              )}
            </Col>
          </Row>
          <Card>
            <Card.Body>
              <Table responsive border hover>
                <thead>{headers}</thead>
                <tbody>{programs}</tbody>
              </Table>
            </Card.Body>
            <ProgramListSubpage
              userId={this.props.userId}
              show={this.state.modalShow}
              setModalHide={this.setModalHide}
              uni_name={this.state.uni_name}
              program_name={this.state.program_name}
              handleChange2={this.handleChange2}
              onSubmitAddToStudentProgramList={
                this.onSubmitAddToStudentProgramList
              }
            />
            <ProgramDeleteWarning
              deleteProgramWarning={this.state.deleteProgramWarning}
              setModalHideDDelete={this.setModalHideDDelete}
              program_id={this.state.program_id}
              program_name={this.state.program_name}
              uni_name={this.state.uni_name}
              RemoveProgramHandler3={this.RemoveProgramHandler3}
            />
            <ProgramAddedMyWatchList
              setModalHide_AddToMyWatchList={this.setModalHide_AddToMyWatchList}
              modalShowNAddMyWatchList={this.state.modalShowNAddMyWatchList}
              program_id={this.state.program_id}
              program_name={this.state.program_name}
              uni_name={this.state.uni_name}
              setModalShow_AddToMyWatchList={this.setModalShow_AddToMyWatchList}
            />
          </Card>
          {!isLoaded && (
            <div style={style}>
              <Spinner animation="border" role="status">
                <span className="visually-hidden"></span>
              </Spinner>
            </div>
          )}
        </>
      );
    }
  }
}

export default Programlist;
