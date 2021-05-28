import React, { useState } from 'react';
import { Row, Col, Card, Table, Form } from 'react-bootstrap';
import { CheckSquare } from 'react-bootstrap-icons';

import {
    Button,
    OverlayTrigger,
    Tooltip,
    ButtonToolbar,
    Dropdown,
    DropdownButton,
    SplitButton
} from 'react-bootstrap';
// import EditIcon from "material-ui/svg-icons/image/edit";
// import TrashIcon from "material-ui/svg-icons/action/delete";
// import CheckIcon from "material-ui/svg-icons/navigation/check";
import TextField from "@material-ui/core/TextField";
import Aux from "../../hoc/_Aux";
import UcFirst from "../../App/components/UcFirst";

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
    cancelEditing
) => {
    const currentlyEditing = editIdx === i;
    return (
        < tr key={x._id} >
            <th>{currentlyEditing ? (
                // <CheckSquare onClick={() => stopEditing(x)} />
                // <OverlayTrigger>
                <div>
                    <Button className='btn-square' variant='danger' onClick={() => stopEditing(x)}><UcFirst text='Save' /></Button>
                    <Button className='btn-square' variant='info' onClick={() => cancelEditing()}><UcFirst text='Cancel' /></Button>

                </div>
                // {/* <Button className='btn-square' variant='info' onClick={() => cancelEditing(x)}><UcFirst text='Save' /></Button> */}
                // </OverlayTrigger>
            ) : (
                <DropdownButton
                    size='sm'
                    title='Option'
                    variant='primary'
                    id={`dropdown-variants-${x._id}`}
                    key={x._id}
                >
                    <Dropdown.Item eventKey="1" onSelect={() => startEditing(i)}>Edit</Dropdown.Item>
                    <Dropdown.Item eventKey="2" onSelect={() => RemoveProgramHandler3(x._id)}>Delete</Dropdown.Item>
                </DropdownButton>
                // <EditIcon onClick={() => startEditing(i)} />
            )}

            </th>
            {header.map((y, k) => (
                // <TableRowColumn key={`trc-${k}`}>
                <td>
                    {/* {x[y.prop]} */}
                    {currentlyEditing ? (
                        <Form>
                            <Form.Group>
                                <Form.Control type="text" onChange={e => handleChange(e, y.prop, i)} value={x[y.prop]} />
                            </Form.Group>
                        </Form>
                        //     name={y.prop}
                        //     onChange={e => handleChange(e, y.prop, i)}
                        //     value={x[y.prop]}
                        // />
                        // x[y.prop]
                    ) : (
                        x[y.prop]
                    )}
                    {/* // </TableRowColumn> */}
                </td>
            ))}
            {/* <th scope="row">{x.University}</th>
            <td>{x.Program} </td>
            <td>{x.TOEFL}</td>
            <td>{x.IELTS}</td>
            <td>{x.Degree}</td>
            <td>{x.GREGMAT}</td>
            <td>{x.Application_end_date}</td> */}
        </tr>
    );
};

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
                            this.props.cancelEditing
                        )


                        // < tr key = { program._id } >
                        //     <th>
                        //         <DropdownButton
                        //             size='sm'
                        //             title='Option'
                        //             variant='primary'
                        //             id={`dropdown-variants-${program._id}`}
                        //             key={program._id}
                        //         >
                        //             {/* {currentlyEditing ? (
                        //                 <CheckIcon onClick={() => this.props.stopEditing()} />
                        //             ) : (
                        //                 <EditIcon onClick={() => this.props.startEditing(i)} />
                        //             )} */}
                        //             <Dropdown.Item eventKey="1" onSelect={() => this.props.EditProgramHandler1(program._id)}>Edit</Dropdown.Item>
                        //             <Dropdown.Item eventKey="2" >Save</Dropdown.Item>
                        //             <Dropdown.Item eventKey="3" onSelect={() => this.props.RemoveProgramHandler3(program._id)}>Delete</Dropdown.Item>
                        //         </DropdownButton>
                        //     </th>
                        //     <th scope="row">{program.University}</th>
                        //     <td>{program.Program} </td>
                        //     <td>{program.TOEFL}</td>
                        //     <td>{program.IELTS}</td>
                        //     <td>{program.Degree}</td>
                        //     <td>{program.GREGMAT}</td>
                        //     <td>{program.Application_end_date}</td>
                        // </tr>
                    )
                    )}
                </tbody>
            </Table >
        )

    }

}

export default Programlist;