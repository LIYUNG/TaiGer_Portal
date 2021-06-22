import React from 'react';
import { Table, Form, Modal } from 'react-bootstrap';
import {
    Button,
    // OverlayTrigger,
    // Tooltip,
    // ButtonToolbar,
    Dropdown,
    DropdownButton,
    // SplitButton
} from 'react-bootstrap';

// import Aux from "../../hoc/_Aux";
import UcFirst from "../../App/components/UcFirst";



class MyVerticallyCenteredModal extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange2 = props.handleChange2.bind(this)
        this.setModalHide = props.setModalHide.bind(this);
        this.onSubmit2 = props.onSubmit2.bind(this);
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
                                            onChange={this.handleChange2}
                                        />
                                    </Form.Group>
                                </div>
                            </th>
                            <td >
                                <h4 className="mb-1" >{student.firstname_}, {student.lastname_}</h4>
                            </td>
                        </tr>
                    ))}
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.onSubmit2}>Assign</Button>
                    <Button onClick={this.setModalHide}>Cancel</Button>
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
                    <Dropdown.Item eventKey="2" onSelect={() => setModalShow(x.University, x.Program, x._id)}>Assign to student...</Dropdown.Item>
                    <Dropdown.Item eventKey="3" onSelect={() => RemoveProgramHandler3(x._id)}>Delete</Dropdown.Item>
                </DropdownButton>
            )}

            </th>
            {header.map((y, k) => (
                <td>
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
                    setModalHide={this.props.setModalHide}
                    uni_name={this.props.Uni_Name}
                    program_name={this.props.Program_Name}
                    handleChange2={this.props.handleChange2}
                    onSubmit2={this.props.onSubmit2}
                />
            </>
        )

    }

}

export default Programlist;