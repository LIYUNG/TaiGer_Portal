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

class Programlist extends React.Component {
    constructor(props) {
        super(props);
        // this.EditProgramHandler1 = this.EditProgramHandler1.bind()
    }
    render() {
        // const currentlyEditing = editIdx === i;
        return (
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
                    {this.props.data.map((program, i )=> (
                        <tr key={program._id}>
                            <th>
                                <DropdownButton
                                    size='sm'
                                    title='Option'
                                    variant='primary'
                                    id={`dropdown-variants-${program._id}`}
                                    key={program._id}
                                >
                                    {/* {currentlyEditing ? (
                                        <CheckIcon onClick={() => this.props.stopEditing()} />
                                    ) : (
                                        <EditIcon onClick={() => this.props.startEditing(i)} />
                                    )} */}
                                    <Dropdown.Item eventKey="1" onSelect={() => this.props.EditProgramHandler1(program._id)}>Edit</Dropdown.Item>
                                    <Dropdown.Item eventKey="2" >Save</Dropdown.Item>
                                    <Dropdown.Item eventKey="3" onSelect={() => this.props.RemoveProgramHandler3(program._id)}>Delete</Dropdown.Item>
                                </DropdownButton>
                            </th>
                            <th scope="row">{program.University}</th>
                            <td>{program.Program} </td>
                            <td>{program.TOEFL}</td>
                            <td>{program.IELTS}</td>
                            <td>{program.Degree}</td>
                            <td>{program.GREGMAT}</td>
                            <td>{program.Application_end_date}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        )

    }

}

export default Programlist;