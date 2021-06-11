import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import {
    // Button,
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

class BootstrapTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            editIdx: -1,
            modalShow: false,
            Uni: "",
            Program: "",
            ProgramId: "",
            StudentId: "",
            data: []
        };
        // this.setModalHide = this.setModalHide.bind(this);
        // this.setModalShow = this.setModalShow.bind(this);
        // this.handleChange = this.handleChange.bind(this);
        // this.handleChange2 = this.handleChange2.bind(this);
        // this.onSubmit = this.onSubmit.bind(this);
        // this.onSubmit2 = this.onSubmit2.bind(this);
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
        console.log("click delete")
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
        this.setState({ editIdx: -1 });
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

    NewProgram = (new_program) => {
        console.log("click NewProgram")
        const university = 'RWTH Aachen'
        const program = 'Economics'
        this.addProgram({ university, program })
        this.setState({
            isLoaded: false,
        });
    }

    // AssignProgramHandler2 = () => {

    // }

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
        // this.setState({
        //     modalShow: false
        // });
    }

    render() {
        const { error, isLoaded } = this.state;
        if (error) {
            //TODO: put error page component for timeout
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Loading...</div>;
        } else {
            return (
                <Aux>
                    <Row>
                        <Col>
                            <Card>
                                <Card.Header>
                                    <Row>
                                        <Col>
                                            <Card.Title as="h5">Program List</Card.Title>
                                        </Col>
                                        <Col>
                                            <ButtonToolbar className="float-right">
                                                <button className="btn btn-primary" type="submit" onClick={() => this.NewProgram()}>New Program</button>
                                            </ButtonToolbar>
                                        </Col>
                                        {/* <span className="d-block m-t-5">use bootstrap <code>Table</code> component</span> */}
                                    </Row>
                                </Card.Header>
                                <Card.Body>
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
                                                prop: "University"
                                            },
                                            {
                                                name: "Program",
                                                prop: "Program"
                                            },
                                            {
                                                name: "TOEFL",
                                                prop: "TOEFL"
                                            },
                                            {
                                                name: "IELTS",
                                                prop: "IELTS"
                                            },
                                            {
                                                name: "Degree",
                                                prop: "Degree"
                                            },
                                            {
                                                name: "GRE/GMAT",
                                                prop: "GREGMAT"
                                            },
                                            {
                                                name: "Application Deadline",
                                                prop: "applicationDeadline"
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