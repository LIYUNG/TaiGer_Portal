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
        this.setmodalhide = this.props.setmodalhide.bind(this);
        this.onDeleteFilefromstudent = this.props.onDeleteFilefromstudent.bind(this);
        this.onDownloadFilefromstudent = this.props.onDownloadFilefromstudent.bind(this);
        // this.onSubmit2 = props.onSubmit2.bind(this);
        // this.state = {
        //     data: [],
        // };
    }

    // componentDidMount() {
    //     const auth = localStorage.getItem('token');
    //     fetch('http://localhost:2000/studentlist',
    //         {
    //             method: 'GET',
    //             headers: {
    //                 Accept: 'application/json',
    //                 'Content-Type': 'application/json',
    //                 'Authorization': 'Bearer ' + JSON.parse(auth)
    //             },
    //         }
    //     )
    //         .then(res => res.json())
    //         .then(
    //             (result) => {
    //                 this.setState({
    //                     // isLoaded: true,
    //                     data: result.data
    //                 });
    //             },
    //             // Note: it's important to handle errors here
    //             // instead of a catch() block so that we don't swallow
    //             // exceptions from actual bugs in components.
    //             (error) => {
    //                 console.log('Problem while getting studentlist');
    //             }
    //         )
    // }

    render() {
        if (this.props.subpage === 1) {
            return (
                <Modal
                    show={this.props.show}
                    onHide={this.props.onHide}
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                >
                    <Modal.Header>
                        <Modal.Title id="contained-modal-title-vcenter">
                            Agent for {this.props.data[this.props.student_i].firstname_} - {this.props.data[this.props.student_i].lastname_} to
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <h4>Agent:</h4>
                        {this.props.data[this.props.student_i].agent_ ? (
                            this.props.data[this.props.student_i].agent_.map((agent, i) => (
                                <div key={i + 1}>
                                    <td>
                                        <Form.Group>
                                            <Form.Check
                                                custom
                                                type="checkbox"
                                                name="student_id"
                                                value={i + 1}
                                                id={i + 1}
                                            />
                                        </Form.Group>
                                    </td>
                                    <td>
                                        <h4 className="mb-1" >{agent}</h4>
                                    </td>
                                </div>
                            ))
                        ) : (
                            <div>
                                <h4 className="mb-1" > No Agent</h4>
                            </div>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.setmodalhide}>Assign</Button>
                        <Button onClick={this.setmodalhide}>Cancel</Button>
                    </Modal.Footer>
                </Modal>
            );
        } else if (this.props.subpage === 2) {
            return (
                <Modal
                    show={this.props.show}
                    onHide={this.props.onHide}
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                >
                    <Modal.Header>
                        <Modal.Title id="contained-modal-title-vcenter">
                            Editor for {this.props.data[this.props.student_i].firstname_} - {this.props.data[this.props.student_i].lastname_}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <h4>Editor:</h4>
                        {this.props.data[this.props.student_i].editor_ ? (
                            this.props.data[this.props.student_i].editor_.map((editor, i) => (
                                < tr key={i + 1} >
                                    <th>
                                        <Form.Group>
                                            <Form.Check
                                                custom
                                                type="checkbox"
                                                name="student_id"
                                                value={i + 1}
                                                id={i + 1}
                                            />
                                        </Form.Group>
                                    </th>
                                    <td >
                                        <h4 className="mb-1" >{editor}
                                        </h4>
                                    </td>
                                </tr>
                            ))) : (
                            <tr>
                                <td>
                                    <h4 className="mb-1" > No Editor</h4>
                                </td>
                            </tr>)
                        }
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.setmodalhide}>Assign</Button>
                        <Button onClick={this.setmodalhide}>Cancel</Button>
                    </Modal.Footer>
                </Modal>
            );
        } else if (this.props.subpage === 3) { // Edit Program
            return (
                <Modal
                    show={this.props.show}
                    onHide={this.props.onHide}
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                >
                    <Modal.Header>
                        <Modal.Title id="contained-modal-title-vcenter">
                            Program for {this.props.data[this.props.student_i].firstname_} - {this.props.data[this.props.student_i].lastname_}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <h4>Program:</h4>
                        <table>
                            <tbody>
                                {this.props.data[this.props.student_i].applying_program_ ? (
                                    this.props.data[this.props.student_i].applying_program_.map((program, i) => (
                                        < tr key={i} >
                                            {/* <th> */}
                                            <Form.Group>
                                                <Form.Check
                                                    custom
                                                    type="checkbox"
                                                    name="student_id"

                                                    value={i}
                                                    id={i + 1}
                                                />
                                            </Form.Group>
                                            {/* </th> */}
                                            <td >
                                                <h4 className="mb-1" >{program.University_}, {program.Program_}
                                                </h4>
                                            </td>
                                        </tr>
                                    ))) : (
                                    <tr>
                                        <td>
                                            <h4 className="mb-1" > No Program</h4>
                                        </td>
                                    </tr>
                                )
                                }
                            </tbody>
                        </table>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.setmodalhide}>Assign</Button>
                        <Button onClick={this.setmodalhide}>Cancel</Button>
                    </Modal.Footer>
                </Modal>
            );
        } else if (this.props.subpage === 4) {
            return (
                <Modal
                    show={this.props.show}
                    onHide={this.props.onHide}
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                >
                    <Modal.Header>
                        <Modal.Title id="contained-modal-title-vcenter">
                            Uploaded files for {this.props.data[this.props.student_i].firstname_} - {this.props.data[this.props.student_i].lastname_}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <h4>Files:</h4>
                        {
                            this.props.data[this.props.student_i].uploadedDocs_ ?
                                (
                                    this.props.documentslist.map((doc, i) => (
                                        this.props.data[this.props.student_i].uploadedDocs_[doc.prop] ?
                                            (
                                                this.props.data[this.props.student_i].uploadedDocs_[doc.prop].uploadStatus_ === "uploaded" ?
                                                    (
                                                        <tr key={i + 1}>
                                                            <th>
                                                                <Form.Group>
                                                                    <Form.Check
                                                                        custom
                                                                        type="checkbox"
                                                                        name={doc.name}
                                                                        defaultChecked={true}
                                                                        // value='value'
                                                                        id={i + 1}
                                                                    />
                                                                </Form.Group>
                                                            </th>
                                                            <td >
                                                                <p className="m-0"> {doc.name} : {this.props.data[this.props.student_i].uploadedDocs_[doc.prop].uploadStatus_}</p>
                                                            </td>
                                                            <td>
                                                                <Col md={2}>
                                                                    <Form onSubmit={(e) => this.onDownloadFilefromstudent(e, doc.prop, this.props.data[this.props.student_i]._id)}>
                                                                        <Form.Group controlId="exampleForm.ControlSelect1">
                                                                            <div className="form-group">
                                                                                <button type="submit">Download</button>
                                                                            </div>
                                                                        </Form.Group>
                                                                    </Form>
                                                                </Col>
                                                            </td>
                                                            <td>
                                                                <Col md={2}>
                                                                    <Form onSubmit={(e) => this.onDeleteFilefromstudent(e, doc.prop, this.props.data[this.props.student_i]._id)}>
                                                                        <Form.Group controlId="exampleForm.ControlSelect1">
                                                                            <div className="form-group">
                                                                                <button type="submit">Delete</button>
                                                                            </div>
                                                                        </Form.Group>
                                                                    </Form>
                                                                </Col>
                                                            </td>
                                                            <td>
                                                                <p className="m-0"> {this.props.data[this.props.student_i].uploadedDocs_[doc.prop].LastUploadDate_}</p>
                                                            </td>
                                                        </tr>
                                                    ) : (
                                                        < tr key={i + 1}>
                                                            <th>
                                                                <div>
                                                                    <Form.Group>
                                                                        <Form.Check
                                                                            custom
                                                                            type="checkbox"
                                                                            name={doc.name}
                                                                            defaultChecked={false}
                                                                            // value='value'
                                                                            id={i + 1}
                                                                        />
                                                                    </Form.Group>
                                                                </div>
                                                            </th>
                                                            <td >
                                                                <p className="m-0"><b> {doc.name} </b></p>
                                                            </td>
                                                        </tr>
                                                    )

                                            ) :
                                            (
                                                < tr key={i + 1}>
                                                    <th>
                                                        <div>
                                                            <Form.Group>
                                                                <Form.Check
                                                                    custom
                                                                    type="checkbox"
                                                                    name={doc.name}
                                                                    defaultChecked={false}
                                                                    // value='value'
                                                                    id={i + 1}
                                                                />
                                                            </Form.Group>
                                                        </div>
                                                    </th>
                                                    <td >
                                                        <p className="m-0"><b> {doc.name} </b></p>
                                                    </td>
                                                </tr>
                                            )
                                    ))
                                ) :
                                (
                                    <p>So far no selected program!</p>
                                )

                        }
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.setmodalhide}>Close</Button>
                    </Modal.Footer>
                </Modal>
            );
        }
        else {
            return (
                <Modal
                    show={this.props.show}
                    onHide={this.props.onHide}
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                >
                    <Modal.Header>
                        <Modal.Title id="contained-modal-title-vcenter">
                            {/* Uploaded files for {this.props.data[this.props.student_i].firstname_} - {this.props.data[this.props.student_i].lastname_} */}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <h4>other:</h4>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.setmodalhide}>Assign</Button>
                        <Button onClick={this.setmodalhide}>Cancel</Button>
                    </Modal.Footer>
                </Modal>
            )
        }
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
    documentslist,
    startUploadfile
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
                                documentslist.map((doc, i) => (
                                    student.uploadedDocs_[doc.prop] ?
                                        (
                                            student.uploadedDocs_[doc.prop].uploadStatus_ === "uploaded" ?
                                                (
                                                    <p className="m-0" key={i} ><AiOutlineCheck /> <AiOutlineLoading3Quarters /> {doc.name} : {student.uploadedDocs_[doc.prop].uploadStatus_}</p>

                                                ) : (
                                                    <p className="m-0" key={i} ><b><AiOutlineClose /> {doc.name} </b></p>
                                                )
                                        ) :
                                        (
                                            <p className="m-0" key={i} ><b><AiOutlineClose /> {doc.name} </b></p>
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
                        (agent, i) =>
                            <p className="m-0" key={i}>{agent}</p>
                    )}
                    <h5>Editor:</h5>
                    {student.editor_.map(
                        (editor, i) =>
                            <p className="m-0" key={i}>{editor}</p>
                    )}
                </td>
                <td>
                    <h5>Programs:</h5>
                    {student.applying_program_.map(
                        (program, i) =>
                            <h6 key={i}>{program.University_} {program.Program_} </h6>
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
                        <Dropdown.Item eventKey="3" onSelect={() => startEditingProgram(i)}>Edit Program</Dropdown.Item>
                        <Dropdown.Item eventKey="4" onSelect={() => startUploadfile(i)}>Upload files</Dropdown.Item>
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
                                this.props.documentslist,
                                this.props.startUploadfile
                            )
                        )
                        )}
                    </tbody>
                </Table >
                <MyVerticallyCenteredModal
                    show={this.props.ModalShow}
                    onHide={this.props.setmodalhide}
                    uni_name='RWTH'
                    program_name='Automotive'
                    setmodalhide={this.props.setmodalhide}
                    subpage={this.props.subpage}
                    student_i={this.props.student_i} // student order
                    data={this.props.data}
                    documentslist={this.props.documentslist}
                    onDownloadFilefromstudent={this.props.onDownloadFilefromstudent}
                    onDeleteFilefromstudent={this.props.onDeleteFilefromstudent}
                />
            </>
        )

    }

}

export default Studentlist;