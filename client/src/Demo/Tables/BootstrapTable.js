import React from 'react';
import { Row, Col, Card, Table } from 'react-bootstrap';
import {
    Button,
    OverlayTrigger,
    Tooltip,
    ButtonToolbar,
    Dropdown,
    DropdownButton,
    SplitButton
} from 'react-bootstrap';
import Aux from "../../hoc/_Aux";
import UcFirst from "../../App/components/UcFirst";
import Programlist from "./ProgramList";
// import axios from 'axios';

const program_list_API = 'http://localhost:2000/programlist';
const delete_program_API = 'http://localhost:2000/deleteprogram';
const add_program_API = 'http://localhost:2000/addprogram';
const edit_program_API = 'http://localhost:2000/editprogram';
// const program_list_API = 'https://54.214.118.145/programlist';

class BootstrapTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            editIdx: -1,
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
                // body: {
                //     id: id
                // }
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
                // body: {
                //     id: id
                // }
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

    startEditing = (i, program_id )=> {
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
    handleChange = (e, name, i) => {
        const { value } = e.target;
        this.setState(state => ({
            data: this.state.data.map(
                (row, j) => (j === i ? { ...row, [name]: value } : row)
            )
        }));
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

    RemoveProgramHandler2 = (e) => {
        console.log("click save")
    }
    RemoveProgramHandler3 = (program_id) => {
        console.log("click delete")
        console.log("id = " + program_id)
        this.deleteProgram({ program_id })
        this.setState({
            isLoaded: false,
        });

    }
    render() {
        const { error, isLoaded, editIdx, data } = this.state;
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
                                        handleRemove={this.handleRemove}
                                        startEditing={this.startEditing}
                                        editIdx={this.state.editIdx}
                                        stopEditing={this.stopEditing}
                                        handleChange={this.handleChange}
                                        data={this.state.data}
                                        cancelEditing={this.cancelEditing}
                                        RemoveProgramHandler3={this.RemoveProgramHandler3}
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