import React from 'react';
import { Row, Col, Card, Tabs, Tab } from 'react-bootstrap';
import Aux from "../../hoc/_Aux";
import DEMO from "../../store/constant";

import avatar1 from '../../assets/images/user/avatar-1.jpg';
import avatar2 from '../../assets/images/user/avatar-2.jpg';
import avatar3 from '../../assets/images/user/avatar-3.jpg';
import Studentlist from "./Studentlist";

const Student_API = 'http://localhost:2000/studentlist';
// const Student_API = 'https://54.214.118.145/studentlist';
const edit_agent_API = 'http://localhost:2000/editagent';
const edit_studentsprogram_API = 'http://localhost:2000/editstudentprogram';

class Dashboard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            error: null,
            modalShow: false,
            isLoaded: false,
            editIdx: -1,
            StudentId: "",
            data: []
        };
    }
    componentDidMount() {
        const auth = localStorage.getItem('token');
        fetch(Student_API,
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
            fetch(Student_API,
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

    editAgent = edited_program => {
        console.log("click edit")
        console.log(edited_program)
        const auth = localStorage.getItem('token');
        fetch(edit_agent_API + "/" + edited_program._id,
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

    editStudentProgram = new_program => {
        console.log("click delete")
        console.log(new_program)
        const auth = localStorage.getItem('token');
        fetch(edit_studentsprogram_API,
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

    startEditingAgent = (i, program_id) => {
        console.log("startEditingAgent")
        // this.setState({ 
        //     editIdx: i 
        // });
    };

    startEditingEditor = (i, program_id) => {
        console.log("startEditingEditor")
        // this.setState({ 
        //     editIdx: i 
        // });
    };

    startEditingProgram = (student_id) => {
        console.log("startEditingAnddeleteProgram")
        this.setState({
            StudentId: student_id,
            modalShow: true
        });
    };

    stopEditing = (edited_program) => {
        this.editAgent(edited_program)
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

    NewStudentProgram = (new_program) => {
        console.log("click NewProgram")
        const university = 'RWTH Aachen'
        const program = 'Economics'
        this.editStudentProgram({ university, program })
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

    // setModalShow = () => {

    // }

    setModalHide = () => {
        this.setState({
            modalShow: false
        });
    }

    render() {
        const tabContent = (
            <Aux>
                <div className="media friendlist-box align-items-center justify-content-center m-b-20">
                    <div className="m-r-10 photo-table">
                        <a href={DEMO.BLANK_LINK}><img className="rounded-circle" style={{ width: '40px' }} src={avatar1} alt="activity-user" /></a>
                    </div>
                    <div className="media-body">
                        <h6 className="m-0 d-inline">Silje Larsen</h6>
                        <span className="float-right d-flex  align-items-center"><i className="fa fa-caret-up f-22 m-r-10 text-c-green" />3784</span>
                    </div>
                </div>
                <div className="media friendlist-box align-items-center justify-content-center m-b-20">
                    <div className="m-r-10 photo-table">
                        <a href={DEMO.BLANK_LINK}><img className="rounded-circle" style={{ width: '40px' }} src={avatar2} alt="activity-user" /></a>
                    </div>
                    <div className="media-body">
                        <h6 className="m-0 d-inline">Julie Vad</h6>
                        <span className="float-right d-flex  align-items-center"><i className="fa fa-caret-up f-22 m-r-10 text-c-green" />3544</span>
                    </div>
                </div>
                <div className="media friendlist-box align-items-center justify-content-center m-b-20">
                    <div className="m-r-10 photo-table">
                        <a href={DEMO.BLANK_LINK}><img className="rounded-circle" style={{ width: '40px' }} src={avatar3} alt="activity-user" /></a>
                    </div>
                    <div className="media-body">
                        <h6 className="m-0 d-inline">Storm Hanse</h6>
                        <span className="float-right d-flex  align-items-center"><i className="fa fa-caret-down f-22 m-r-10 text-c-red" />2739</span>
                    </div>
                </div>
            </Aux>
        );

        const { error, isLoaded } = this.state;
        if (error) {
            //TODO: put error page component for timeout
            return <div>Error: your session is timeout! Please Login</div>;
        } else if (!isLoaded) {
            return <div>Loading...</div>;
        } else {
            return (
                <Aux>
                    <Row>
                        <Col md={6} xl={8}>
                            <Card className='Recent-Users'>
                                <Card.Header>
                                    <Card.Title as='h5'>Student List</Card.Title>
                                </Card.Header>
                                <Card.Body className='px-0 py-2'>
                                    {/* <Table responsive hover>
                                        <tbody>
                                            {data.map(student =>
                                                <tr className="unread" key={student._id}>
                                                    <td><img className="rounded-circle" style={{ width: '40px' }} src={avatar1} alt="activity-user" /></td>
                                                    <td >
                                                        <h6 className="mb-1">{student.firstname_} {student.lastname_}</h6>
                                                        <p className="m-0">{student.emailaddress_}</p>
                                                    </td>
                                                    <td>
                                                        <h5>Agent: {student.agent_.map(
                                                            agent =>
                                                                <h6> {agent}</h6>
                                                        )}</h5>
                                                        <h5>Editor: {student.editor_.map(
                                                            editor =>
                                                                <h6> {editor}</h6>
                                                        )}
                                                        </h5>
                                                    </td>
                                                    <th>
                                                        <DropdownButton
                                                            size='sm'
                                                            title='Option'
                                                            variant='primary'
                                                            id={`dropdown-variants-${student._id}`}
                                                            key={student._id}
                                                        >
                                                            <Dropdown.Item eventKey="1">Edit Agent</Dropdown.Item>
                                                            <Dropdown.Item eventKey="2">Edit Editor</Dropdown.Item>
                                                            <Dropdown.Item eventKey="3">Edit Program</Dropdown.Item>
                                                        </DropdownButton>
                                                    </th>
                                                </tr>
                                            )}
                                        </tbody>
                                    </Table> */}
                                    <Studentlist
                                        ModalShow={this.state.modalShow}
                                        setModalShow={this.setModalShow}
                                        setModalHide={this.setModalHide}
                                        handleRemove={this.handleRemove}
                                        startEditingAgent={this.startEditingAgent}
                                        startEditingEditor={this.startEditingEditor}
                                        startEditingProgram={this.startEditingProgram}
                                        editIdx={this.state.editIdx}
                                        stopEditing={this.stopEditing}
                                        handleChange={this.handleChange}
                                        data={this.state.data}
                                        cancelEditing={this.cancelEditing}
                                        RemoveProgramHandler3={this.RemoveProgramHandler3}
                                        header={[
                                            {
                                                name: "StudentName",
                                                prop: "StudentName"
                                            },
                                            {
                                                name: "Agent",
                                                prop: "agent_"
                                            },
                                            {
                                                name: "Editor",
                                                prop: "editor_"
                                            },
                                            {
                                                name: "Program",
                                                prop: "Program"
                                            }
                                        ]}
                                    />
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={6} xl={4}>
                            <Card className='card-event'>
                                <Card.Body>
                                    <div className="row align-items-center justify-content-center">
                                        <div className="col">
                                            <h5 className="m-0">Upcoming Event</h5>
                                        </div>
                                        <div className="col-auto">
                                            <label className="label theme-bg2 text-white f-14 f-w-400 float-right">34%</label>
                                        </div>
                                    </div>
                                    <h2 className="mt-2 f-w-300">45<sub className="text-muted f-14">Competitors</sub></h2>
                                    <h6 className="text-muted mt-3 mb-0">You can participate in event </h6>
                                    <i className="fa fa-angellist text-c-purple f-50" />
                                </Card.Body>
                            </Card>
                            <Card>
                                <Card.Body className='border-bottom'>
                                    <div className="row d-flex align-items-center">
                                        <div className="col-auto">
                                            <i className="feather icon-zap f-30 text-c-green" />
                                        </div>
                                        <div className="col">
                                            <h3 className="f-w-300">235</h3>
                                            <span className="d-block text-uppercase">total ideas</span>
                                        </div>
                                    </div>
                                </Card.Body>
                                <Card.Body>
                                    <div className="row d-flex align-items-center">
                                        <div className="col-auto">
                                            <i className="feather icon-map-pin f-30 text-c-blue" />
                                        </div>
                                        <div className="col">
                                            <h3 className="f-w-300">26</h3>
                                            <span className="d-block text-uppercase">total locations</span>
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={6} xl={8} className='m-b-30'>
                            <Tabs defaultActiveKey="today" id="uncontrolled-tab-example">
                                <Tab eventKey="today" title="Today">
                                    {tabContent}
                                </Tab>
                                <Tab eventKey="week" title="This Week">
                                    {tabContent}
                                </Tab>
                                <Tab eventKey="all" title="All">
                                    {tabContent}
                                </Tab>
                            </Tabs>
                        </Col>
                    </Row>
                </Aux>
            );
        }
    }
}

export default Dashboard;