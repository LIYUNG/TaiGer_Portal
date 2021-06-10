import React, { useState } from 'react';
import { Row, Col, Card, Table, Form, Modal } from 'react-bootstrap';
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

class MyVerticallyCenteredModal extends React.Component {
    constructor(props) {
        super(props);
        this.AssignProgramHandler = this.props.AssignProgramHandler.bind(this)
        this.state = {
            data: []
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
                        isLoaded: true,
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
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Assign {this.props.Uni_Name} - {this.props.Program_Name} to
          </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h4>Student:</h4>
                    {this.state.data.map(student => (
                        < tr key={student._id} >
                            <td >
                                <h4 className="mb-1">{student.firstname_}, {student.lastname_}</h4>
                            </td>
                        </tr>
                    ))}
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => this.AssignProgramHandler('60a116ba6f221e768c0803c7')}>Assign</Button>
                    <Button onClick={this.props.onHide}>Cancel</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

const row = (
    x,
    i,
    header,
    handleRemove,
    startEditing,
    editIdx,
    handleChange,
    stopEditing,
    AssignProgramHandler2,
    RemoveProgramHandler3,
    cancelEditing,
    setModalShow,
) => {
    const currentlyEditing = editIdx === i;
    return (
        < tr key={x._id} >
            <th>{currentlyEditing ? (
                <div>
                    <Button className='btn-square' variant='danger' onClick={() => stopEditing(x)}><UcFirst text='Save' /></Button>
                    <Button className='btn-square' variant='info' onClick={() => cancelEditing()}><UcFirst text='Cancel' /></Button>

                </div>
            ) : (
                <DropdownButton
                    size='sm'
                    title='Option'
                    variant='primary'
                    id={`dropdown-variants-${x._id}`}
                    key={x._id}
                >
                    <Dropdown.Item eventKey="1" onSelect={() => startEditing(i)}>Edit</Dropdown.Item>
                    {/* <Dropdown.Item eventKey="2" onSelect={() => AssignProgramHandler2(x._id)}>Assign Program</Dropdown.Item> */}
                    <Dropdown.Item eventKey="2" onSelect={() => setModalShow(x.University, x.Program, x._id)}>Assign to student...</Dropdown.Item>
                    <Dropdown.Item eventKey="3" onSelect={() => RemoveProgramHandler3(x._id)}>Delete</Dropdown.Item>
                </DropdownButton>
            )}

            </th>
            {header.map((y, k) => (
                <td>
                    {/* {x[y.prop]} */}
                    {currentlyEditing ? (
                        <Form>
                            <Form.Group>
                                <Form.Control type="text" onChange={e => handleChange(e, y.prop, i)} value={x[y.prop]} />
                            </Form.Group>
                        </Form>
                    ) : (
                        x[y.prop]
                    )}
                </td>
            ))}
        </tr>
    );
};

class Programlist extends React.Component {
    constructor(props) {
        super(props);

    }
    render() {
        return (
            <>
                <Table responsive>
                    <thead>
                        <tr>
                            <th> </th>
                            {this.props.header.map((x, i) => (
                                <th>{x.name}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.data.map((program, i) => (
                            row(
                                program,
                                i,
                                this.props.header,
                                this.props.handleRemove,
                                this.props.startEditing,
                                this.props.editIdx,
                                this.props.handleChange,
                                this.props.stopEditing,
                                this.props.AssignProgramHandler2,
                                this.props.RemoveProgramHandler3,
                                this.props.cancelEditing,
                                this.props.setModalShow
                            )
                        )
                        )}
                    </tbody>
                </Table >
                <MyVerticallyCenteredModal
                    show={this.props.ModalShow}
                    onHide={() => this.props.setModalHide()}
                    AssignProgramHandler={this.props.AssignProgramHandler2}
                    ProgramID={this.props.ProgramID}
                    Uni_Name={this.props.Uni_Name}
                    Program_Name={this.props.Program_Name}
                />
            </>
        )

    }

}

export default Programlist;