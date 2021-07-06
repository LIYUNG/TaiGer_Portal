import React from 'react';
import { Row, Col, Card, Form, Modal } from 'react-bootstrap';
import {
    Button,
    // OverlayTrigger,
    // Tooltip,
    ButtonToolbar,
    // Dropdown,
    // DropdownButton,
    // SplitButton
} from 'react-bootstrap';
import Aux from "../../hoc/_Aux";
// import UcFirst from "../../App/components/UcFirst";
import Programlist from "./ProgramList";
// import axios from 'axios';

const program_list_API = 'http://localhost:2000/programlist';
const delete_program_API = 'http://localhost:2000/deleteprogram';
const add_program_API = 'http://localhost:2000/addprogram';
const edit_program_API = 'http://localhost:2000/editprogram';
const assign_program_API = 'http://localhost:2000/assignprogramtostudent';
// const program_list_API = 'https://54.214.118.145/programlist';

class NewProgramWindow extends React.Component {
    constructor(props) {
        super(props);
        this.setModalHide2 = props.setModalHide2.bind(this);
        this.handleChangeNewProgram = props.handleChangeNewProgram.bind(this);
        this.submitNewProgram = props.submitNewProgram.bind(this);
        this.state = {
            data: [],
        };

    }

    render() {
        return (
            <Modal
                show={this.props.show}
                onHide={this.props.setModalHide2}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header>
                    <Modal.Title id="contained-modal-title-vcenter">
                        New Program:
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {this.props.header.map((head, i) => (
                        <>
                            <h5 key={i}>{head.name}:</h5>
                            <Form>
                                <Form.Group>
                                    {/* <p>{prop}:</p> */}
                                    <Form.Control type="text" onChange={e => this.handleChangeNewProgram(e, head.prop, i)} value={this.props.newProgramData[head.prop]} />
                                </Form.Group>
                            </Form>
                        </>
                    ))}
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => this.submitNewProgram()}>Assign</Button>
                    <Button onClick={this.setModalHide2}>Cancel</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

class BootstrapTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            editIdx: -1,
            modalShow: false,
            modalShowNewProgram: false,
            Uni: "",
            Program: "",
            ProgramId: "",
            StudentId: "",
            newProgramData: [],
            data: []
        };
    }

    componentDidMount() {
        const auth = localStorage.getItem('token');
        fetch(program_list_API,
            {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + JSON.parse(auth)
                },
            }
        )
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        isLoaded: true,
                        data: result.data
                    });
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error
                    });
                }
            )
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.isLoaded === false) {
            const auth = localStorage.getItem('token');
            fetch(program_list_API,
                {
                    method: 'GET',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + JSON.parse(auth)
                    },
                }
            )
                .then(res => res.json())
                .then(
                    (result) => {
                        this.setState({
                            isLoaded: true,
                            data: result.data
                        });
                    },
                    // Note: it's important to handle errors here
                    // instead of a catch() block so that we don't swallow
                    // exceptions from actual bugs in components.
                    (error) => {
                        this.setState({
                            isLoaded: true,
                            error
                        });
                    }
                )
        }
    }

    // shouldComponentUpdate(nextProps) {
    //     if (nextProps.isLoaded !== this.state.isLoaded) { 
    //         return true; 
    //       } else { 
    //         return false; 
    //       } 
    // }

    deleteProgram = program_id => {
        console.log("click delete")
        console.log(program_id)
        const auth = localStorage.getItem('token');
        fetch(delete_program_API,
            {
                method: 'DELETE',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + JSON.parse(auth)
                },
                body: JSON.stringify(program_id)
            }
        )
            .then(res => res.json())
            .then(
                // (result) => {
                //     this.setState({
                //         isLoaded: false,
                //     });
                // },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    // this.setState({
                    //     isLoaded: false,
                    //     error
                    // });
                }
            )
    }

    editProgram = edited_program => {
        console.log("click edit")
        console.log(edited_program)
        const auth = localStorage.getItem('token');
        fetch(edit_program_API + "/" + edited_program._id,
            {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + JSON.parse(auth)
                },
                body: JSON.stringify(edited_program)
            }
        )
            .then(res => res.json())
            .then(
                // (result) => {
                //     this.setState({
                //         isLoaded: false,
                //     });
                // },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    // this.setState({
                    //     isLoaded: false,
                    //     error
                    // });
                }
            )
    }


    addProgram = new_program => {
        console.log("click addProgram")
        console.log(new_program)
        const auth = localStorage.getItem('token');
        fetch(add_program_API,
            {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + JSON.parse(auth)
                },
                body: JSON.stringify(new_program)
            }
        )
            .then(res => res.json())
            .then(
                // (result) => {
                //     this.setState({
                //         isLoaded: false,
                //     });
                // },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    // this.setState({
                    //     isLoaded: false,
                    //     error
                    // });
                }
            )
    }


    handleRemove = i => {
        this.setState(state => ({
            data: state.data.filter((row, j) => j !== i)
        }));
    };

    startEditing = (i, program_id) => {
        this.setState({
            editIdx: i
        });
    };

    stopEditing = (edited_program) => {
        this.editProgram(edited_program)
        this.setState({
            editIdx: -1,
            isLoaded: false,
        });
    };

    cancelEditing = () => {
        console.log("cancel edit")
        this.setState({
            editIdx: -1,
            // isLoaded: false
        });
    }

    handleSave = (i, x) => {
        this.setState(state => ({
            data: this.state.data.map((row, j) => (j === i ? x : row))
        }));
        this.stopEditing();
    };

    handleChange = (e, name, i) => {
        const { value } = e.target;
        this.setState(state => ({
            data: this.state.data.map(
                (row, j) => (j === i ? { ...row, [name]: value } : row)
            )
        }));
        // this.cancelEditing();
    };

    handleChangeNewProgram = (e, name, i) => {
        const { value } = e.target;
        this.setState(prevState => ({
            newProgramData: {
                ...prevState.newProgramData,
                [name]: value
            }

        }));
    };

    NewProgram = (new_program) => {
        console.log("click NewProgram")
        this.setState({
            modalShowNewProgram: true
        });
    }

    submitNewProgram = () => {
        console.log(this.state.newProgramData)
        this.addProgram(this.state.newProgramData)
        this.setState({
            editIdx: -1,
            newProgramData: [],
            modalShowNewProgram: false,
            isLoaded: false,
        });
    };

    RemoveProgramHandler3 = (program_id) => {
        console.log("click delete")
        console.log("id = " + program_id)
        this.deleteProgram({ program_id })
        this.setState({
            isLoaded: false,
        });

    }
    validate = () => {
        let isError = false;
        const errors = {
            firstName: "",
            lastName: "",
            username: "",
            email: "",
            password: ""
        };

        const { username, email } = this.state.values;

        if (username.length < 5) {
            isError = true;
            errors.username = "Username needs to be atleast 5 characters long";
        }

        if (email.indexOf("@") === -1) {
            isError = true;
            errors.email = "Requires valid email";
        }

        this.setState({
            errors
        });

        return isError;
    };


    setModalShow = (uni_name, program_name, programID) => {
        this.setState({
            modalShow: true,
            Uni: uni_name,
            Program: program_name,
            ProgramId: programID

        });
    }

    setModalHide = () => {
        this.setState({
            modalShow: false
        });
    }

    setModalHide2 = () => {
        this.setState({
            modalShowNewProgram: false
        });
    }

    onSubmit = e => {
        e.preventDefault();
        const err = this.validate();
        if (!err) {
            this.props.handleSave(this.props.i, this.state.values);
        }
    };

    assignProgram = (assign_data) => {
        console.log("click assign Program")
        console.log(assign_data)
        const auth = localStorage.getItem('token');
        fetch(assign_program_API,
            {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + JSON.parse(auth)
                },
                body: JSON.stringify(assign_data)
            }
        )
            .then(res => res.json())
            .then(
                // (result) => {
                //     this.setState({
                //         isLoaded: false,
                //     });
                // },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    // this.setState({
                    //     isLoaded: false,
                    //     error
                    // });
                }
            )
    }

    handleChange2 = (e) => {
        const { value } = e.target;
        // console.log("std_id " + value)
        console.log("program_id " + this.state.ProgramId)
        console.log("student_id " + value)
        this.setState(state => ({
            StudentId: value
        }));

    };

    onSubmit2 = (e) => {
        e.preventDefault();
        const program_id = this.state.ProgramId;
        const student_id = this.state.StudentId;
        console.log("before submit")
        console.log("program_id " + this.state.ProgramId)
        console.log("student_id " + this.state.StudentId)
        this.assignProgram({ student_id, program_id })
        console.log("click assign")
        this.setModalHide()
    }

    render() {
        const { error, isLoaded } = this.state;
        if (error) {
            //TODO: put error page component for timeout
            localStorage.removeItem('token');
            return <div>Error: your session is timeout! Please refresh the page and Login</div>;
        } else if (!isLoaded) {
            return <div>Loading...</div>;
        } else {
            return (
                <Aux>
                    <Row>
                        <Col>
                            <Card>
                                {/* <Card.Header>
                                    
                                </Card.Header> */}
                                <Card.Body>
                                    <Row>
                                        <Col>
                                            <Card.Title as="h4">Program List</Card.Title>
                                        </Col>
                                        <Col>
                                            <ButtonToolbar className="float-right">
                                                <button className="btn btn-primary" type="submit" onClick={() => this.NewProgram()}>New Program</button>
                                            </ButtonToolbar>
                                        </Col>
                                        {/* <span className="d-block m-t-5">use bootstrap <code>Table</code> component</span> */}
                                    </Row>
                                    <Programlist
                                        ModalShow={this.state.modalShow}
                                        ProgramID={this.state.ProgramId}
                                        StudentId={this.state.StudentId}
                                        Uni_Name={this.state.Uni}
                                        Program_Name={this.state.Program}
                                        setModalShow={this.setModalShow}
                                        setModalHide={this.setModalHide}
                                        handleRemove={this.handleRemove}
                                        startEditing={this.startEditing}
                                        editIdx={this.state.editIdx}
                                        stopEditing={this.stopEditing}
                                        handleChange={this.handleChange}
                                        handleChange2={this.handleChange2}
                                        data={this.state.data}
                                        cancelEditing={this.cancelEditing}
                                        RemoveProgramHandler3={this.RemoveProgramHandler3}
                                        onSubmit2={this.onSubmit2}
                                        header={[
                                            {
                                                name: "University",
                                                prop: "University_"
                                            },
                                            {
                                                name: "Program",
                                                prop: "Program_"
                                            },
                                            {
                                                name: "TOEFL",
                                                prop: "TOEFL_"
                                            },
                                            {
                                                name: "IELTS",
                                                prop: "IELTS_"
                                            },
                                            {
                                                name: "Degree",
                                                prop: "Degree_"
                                            },
                                            {
                                                name: "GRE/GMAT",
                                                prop: "GREGMAT_"
                                            },
                                            {
                                                name: "Application Deadline",
                                                prop: "Application_end_date_"
                                            },
                                            {
                                                name: "Last Update",
                                                prop: "LastUpdate_"
                                            }
                                        ]}
                                    />
                                    <NewProgramWindow
                                        show={this.state.modalShowNewProgram}
                                        setModalHide2={this.setModalHide2}
                                        handleChangeNewProgram={this.handleChangeNewProgram}
                                        submitNewProgram={this.submitNewProgram}
                                        newProgramData={this.state.newProgramData}
                                        header={[
                                            {
                                                name: "University",
                                                prop: "University_"
                                            },
                                            {
                                                name: "Program",
                                                prop: "Program_"
                                            },
                                            {
                                                name: "TOEFL",
                                                prop: "TOEFL_"
                                            },
                                            {
                                                name: "IELTS",
                                                prop: "IELTS_"
                                            },
                                            {
                                                name: "Degree",
                                                prop: "Degree_"
                                            },
                                            {
                                                name: "GRE/GMAT",
                                                prop: "GREGMAT_"
                                            },
                                            {
                                                name: "Application Deadline",
                                                prop: "Application_end_date_"
                                            },
                                            {
                                                name: "CV Deadline",
                                                prop: "CV_"
                                            },
                                            {
                                                name: "ML",
                                                prop: "ML_"
                                            },
                                            {
                                                name: "RL",
                                                prop: "RL_"
                                            },
                                            {
                                                name: "Bachelor Certificate",
                                                prop: "bachelorCertificate_"
                                            },
                                            {
                                                name: "Bachelor Transcript",
                                                prop: "bachelorTranscript_"
                                            },
                                            {
                                                name: "High School Diploma",
                                                prop: "highSchoolDiploma_"
                                            },
                                            {
                                                name: "High School Transcript",
                                                prop: "highSchoolTranscript_"
                                            },
                                            {
                                                name: "GSAT(基測)",
                                                prop: "GSAT_"
                                            },
                                            {
                                                name: "English Certificate",
                                                prop: "EnglischCertificate_"
                                            },
                                            {
                                                name: "German Certificate",
                                                prop: "GermanCertificate_"
                                            },
                                            {
                                                name: "Essay",
                                                prop: "Essay_"
                                            },
                                            {
                                                name: "ECTS Conversion",
                                                prop: "ECTS_coversion_"
                                            },
                                            {
                                                name: "Course Description",
                                                prop: "CourseDescription_"
                                            }
                                        ]}
                                    />
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Aux>
            )
        }
    }
}

export default BootstrapTable;