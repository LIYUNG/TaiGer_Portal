import React from 'react';
import { Table } from 'react-bootstrap';
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
    cancelEditing
) => {
    const currentlyEditing = editIdx === i;
    return (
        < tr key={student._id} >
            <td>
                <img className="rounded-circle" style={{ width: '40px' }} src={avatar1} alt="activity-user" />
            </td>
            <td >
                <h6 className="mb-1">{student.firstname_} {student.lastname_}</h6>
                <p className="m-0">{student.emailaddress_}</p>
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
                        <h6>{program.University} {program.Program}</h6>
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
                </DropdownButton>
            )}
            </th>
        </tr>
    );
};

class Studentlist extends React.Component {
    // constructor(props) {
    //     super(props);
    // }
    render() {
        return (
            <Table responsive>
                {/* <thead>
                    <tr>
                        <th> </th>
                        {this.props.header.map((x, i) => (
                            <th>{x.name}</th>
                        ))}
                    </tr>
                </thead> */}
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
                            this.props.cancelEditing
                        )
                    )
                    )}
                </tbody>
            </Table >
        )

    }

}

export default Studentlist;