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
const edit_program_API = 'http://localhost:2000/getprogram';
// const program_list_API = 'https://54.214.118.145/programlist';

// async function deleteprogram(program_id) {

// }


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

    editProgram = program_id => {
        console.log("click edit")
        console.log(program_id)
        const auth = localStorage.getItem('token');
        fetch(edit_program_API + "/" + program_id,
            {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + JSON.parse(auth)
                },
                // body: {
                //     id: id
                // }
                // body: JSON.stringify(program_id)
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

    startEditing = i => {
        this.setState({ editIdx: i });
    };

    stopEditing = () => {
        this.setState({ editIdx: -1 });
    };

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
    EditProgramHandler1 = (program_id) => {
        console.log("click edit")
        console.log("program id" + program_id)
        this.editProgram(program_id)
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
        const buttonVariants = [
            'primary',
            // 'secondary',
            // 'success',
            // 'danger',
            // 'warning',
            // 'info',
            // 'light',
            // 'dark',
        ];

        const buttonOptions = [
            { variant: 'primary', icon: 'feather icon-thumbs-up' },
            // { variant: 'secondary', icon: 'feather icon-camera' },
            // { variant: 'success', icon: 'feather icon-check-circle' },
            // { variant: 'danger', icon: 'feather icon-slash' },
            // { variant: 'warning', icon: 'feather icon-alert-triangle' },
            // { variant: 'info', icon: 'feather icon-info' }
        ];

        const basicButtons = buttonVariants.map((variant, idx) => (
            <OverlayTrigger key={idx} overlay={<Tooltip>{variant}</Tooltip>}>
                <Button variant={variant}><UcFirst text={variant} /></Button>
            </OverlayTrigger>
        ));

        const basicDropdownButton = buttonOptions.map(
            button => {
                const title = <UcFirst text={button.variant} />;
                return (
                    <DropdownButton
                        title='Option'
                        variant='primary'
                        id={`dropdown-variants-${button.variant}`}
                        key={button.variant}
                    >
                        <Dropdown.Item eventKey="1">Edit</Dropdown.Item>
                        <Dropdown.Item eventKey="2">Save</Dropdown.Item>
                        <Dropdown.Item eventKey="3">Delete</Dropdown.Item>
                    </DropdownButton>
                );
            });


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
                                        EditProgramHandler1={this.EditProgramHandler1}
                                        RemoveProgramHandler3={this.RemoveProgramHandler3}
                                        header={[
                                            {
                                                name: "University",
                                                prop: "university"
                                            },
                                            {
                                                name: "Program",
                                                prop: "program"
                                            },
                                            {
                                                name: "TOEFL",
                                                prop: "toefl"
                                            },
                                            {
                                                name: "IELTS",
                                                prop: "ielts"
                                            },
                                            {
                                                name: "Degree",
                                                prop: "degree"
                                            },
                                            {
                                                name: "GRE/GMAT",
                                                prop: "gregmat"
                                            },
                                            {
                                                name: "Application Deadline",
                                                prop: "applicationdeadline"
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