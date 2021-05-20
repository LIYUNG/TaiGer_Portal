import React, { Component } from 'react';
import { Row, Col, Card, Form, Button, InputGroup, FormControl, DropdownButton, Dropdown } from 'react-bootstrap';

export default class FilesUploadComponent extends Component {
    render() {
        return (
            <Row >
                <Col md={1}>
                    {/* <Form.Group> */}
                        <Form.Check
                            custom
                            type="checkbox"
                            id="checkbox1"
                            label="status"
                        />
                    {/* </Form.Group> */}
                </Col>
                <Col md={6}>
                    {/* <Form> */}
                    {/* <div className="form-control" id="customFile"> */}
                    <input type="file" className="form-control" id="customFile" />
                    {/* </div> */}
                    {/* </Form> */}
                </Col>
                <Col md={4}>
                    <Form.Group controlId="exampleForm.ControlSelect1">
                        <div className="form-group">
                            <button className="btn btn-primary" type="submit">Upload</button>
                        </div>
                    </Form.Group>
                </Col>
            </Row>
        )
    }
}