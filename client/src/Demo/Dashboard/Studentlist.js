import React from 'react';
import { FaBeer } from 'react-icons/fa';
import { AiFillCheckCircle, AiOutlineLoading3Quarters, AiOutlineCheck, AiOutlineClose, AiFillStop } from "react-icons/ai";
import { Row, Col, Table, Form, Modal } from 'react-bootstrap';
import {
    Button,
    // OverlayTrigger,
    // Tooltip,
    // ButtonToolbar,
    Dropdown,
    DropdownButton,
    // SplitButton
} from 'react-bootstrap';
import avatar1 from '../../assets/images/user/avatar-1.jpg';
// import avatar2 from '../../assets/images/user/avatar-2.jpg';
// import avatar3 from '../../assets/images/user/avatar-3.jpg';
// import Aux from "../../hoc/_Aux";
import UcFirst from "../../App/components/UcFirst";

class MyVerticallyCenteredModal extends React.Component {
    constructor(props) {
        super(props);
        // this.handleChange2 = props.handleChange2.bind(this)
        this.setModalHide = props.setModalHide.bind(this);
        // this.onSubmit2 = props.onSubmit2.bind(this);
        this.state = {
            data: [],
        };

    }

    componentDidMount() {
        const auth = localStorage.getItem('token');
        fetch('http://localhost:2000/studentlist',
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
                        // isLoaded: true,
                        data: result.data
                    });
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    console.log('Problem while getting studentlist');
                }
            )
    }

    render() {
        return (
            <Modal
                {...this.props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Assign {this.props.uni_name} - {this.props.program_name} to
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h4>Student:</h4>
                    {this.state.data.map(student => (
                        < tr key={student._id} >
                            <th>
                                <div>
                                    <Form.Group>
                                        <Form.Check
                                            custom
                                            type="radio"
                                            name="student_id"
                                            value={student._id}
                                            id={student._id}
                                        // onChange={this.handleChange2}
                                        />
                                    </Form.Group>
                                </div>
                            </th>
                            <td >
                                <h4 className="mb-1" >{student.emailaddress_}, {student.applying_program_.map(program => (
                                    program.University_, program.Program_
                                ))}
                                </h4>
                            </td>
                        </tr>
                    ))}
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.setModalHide}>Assign</Button>
                    <Button onClick={this.setModalHide}>Cancel</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}


const row = (
    student,
    i,
    header,
    handleRemove,
    startEditingAgent,
    startEditingEditor,
    startEditingProgram,
    editIdx,
    handleChange,
    stopEditing,
    RemoveProgramHandler3,
    cancelEditing,
    documentslist
) => {
    const currentlyEditing = editIdx === i;
    return (
        < tr key={student._id} >
            <>
                <td>
                    <img className="rounded-circle" style={{ width: '40px' }} src={avatar1} alt="activity-user" />
                </td>
                <td >
                    <h6 className="mb-1">{student.firstname_} {student.lastname_}</h6>
                    <p className="m-1">{student.emailaddress_}</p>
                    <h6 className="m-0">Document status</h6>
                    {
                        student.uploadedDocs_ ?
                            (
                                documentslist.map((doc) => (
                                    student.uploadedDocs_[doc.prop] ?
                                        (
                                            <p className="m-0"><AiOutlineCheck /> <AiOutlineLoading3Quarters/> {doc.name} : {student.uploadedDocs_[doc.prop].uploadStatus_}</p>
                                        ) :
                                        (
                                            <p className="m-0"><b><AiOutlineClose /> {doc.name} </b></p>
                                        )
                                ))
                            ) :
                            (
                                <p>So far no uploaded file!</p>
                            )

                    }

                    {/* <p>CV Status: {student.uploadedDocs_.CV_.uploadStatus_}, uploaded on {student.uploadedDocs_.CV_.LastUploadDate_}</p>
                    <p>ML Status: {student.uploadedDocs_.ML_.uploadStatus_}, uploaded on {student.uploadedDocs_.ML_.LastUploadDate_}</p>
                    <p>Bachelor Certificate_ Status: {student.uploadedDocs_.bachelorCertificate_.uploadStatus_}, uploaded on {student.uploadedDocs_.bachelorCertificate_.LastUploadDate_}</p> */}

                </td>
                <td>
                    <h5>Agent:</h5>
                    {student.agent_.map(
                        agent =>
                            <p className="m-0">{agent}</p>
                    )}
                    <h5>Editor:</h5>
                    {student.editor_.map(
                        editor =>
                            <p className="m-0">{editor}</p>
                    )}
                </td>
                <td>
                    <h5>Programs:</h5>
                    {student.applying_program_.map(
                        program =>
                            <h6>{program.University_} {program.Program_} </h6>
                        // <h6>{program.University_} {program.Program_} {program.applicationDocu_.CV_.needToBeUpload_}</h6>
                    )}
                </td>
                <th>{currentlyEditing ? (
                    <div>
                        <Button className='btn-square' variant='danger' onClick={() => stopEditing(student)}><UcFirst text='Save' /></Button>
                        <Button className='btn-square' variant='info' onClick={() => cancelEditing()}><UcFirst text='Cancel' /></Button>
                    </div>
                ) : (
                    <DropdownButton
                        size='sm'
                        title='Option'
                        variant='primary'
                        id={`dropdown-variants-${student._id}`}
                        key={student._id}
                    >
                        <Dropdown.Item eventKey="1" onSelect={() => startEditingAgent(i)}>Edit Agent</Dropdown.Item>
                        <Dropdown.Item eventKey="2" onSelect={() => startEditingEditor(i)}>Edit Editor</Dropdown.Item>
                        <Dropdown.Item eventKey="3" onSelect={() => startEditingProgram(student._id)}>Edit Program</Dropdown.Item>
                    </DropdownButton>
                )}
                </th>
                {/* <Row>
                    <h4>{student._id}</h4>
                </Row> */}
            </>
        </tr>
    );
};

class Studentlist extends React.Component {
    render() {
        return (
            <>
                <Table responsive>
                    <tbody>
                        {this.props.data.map((student, i) => (
                            row(
                                student,
                                i,
                                this.props.header,
                                this.props.handleRemove,
                                this.props.startEditingAgent,
                                this.props.startEditingEditor,
                                this.props.startEditingProgram,
                                this.props.editIdx,
                                this.props.handleChange,
                                this.props.stopEditing,
                                this.props.RemoveProgramHandler3,
                                this.props.cancelEditing,
                                this.props.documentslist
                            )
                        )
                        )}
                    </tbody>
                </Table >
                <MyVerticallyCenteredModal
                    show={this.props.ModalShow}
                    uni_name='RWTH'
                    program_name='Automotive'
                    setModalHide={this.props.setModalHide}
                    startEditingProgram={this.props.startEditingProgram}
                />
            </>
        )

    }

}

export default Studentlist;