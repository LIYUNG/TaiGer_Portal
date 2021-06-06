import React, { Component } from 'react';
import { Row, Col, Card, Form, Button, InputGroup, FormControl, DropdownButton, Dropdown } from 'react-bootstrap';
import axios from 'axios';

export default class FilesUploadComponent extends Component {

    constructor(props) {
        super(props);

        this.onFileChange = this.onFileChange.bind(this);
        this.onSubmitFile = this.onSubmitFile.bind(this);

        this.state = {
            file: ''
        }
    }

    onFileChange(e) {
        this.setState({ file: e.target.files[0] })
    }

    onSubmitFile(e) {
        e.preventDefault()
        const formData = new FormData()
        const auth = localStorage.getItem('token');
        formData.append('file', this.state.file)
        axios.post("http://localhost:2000/upload", formData, {
        // axios.post("https://54.214.118.145/upload", formData, {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + JSON.parse(auth)
            }
        }).then(res => {
            console.log(res)
            alert("upload image successful")
        })
    }

    render() {
        return (
            <Row>
                <Col md={1}>
                    <Form>
                        <Form.Group>
                            <Form.Check
                                custom
                                type="checkbox"
                                id="checkbox1"
                                label="status"
                            />
                        </Form.Group>
                    </Form>
                </Col>
                <Col md={6}>
                    <Form>
                        {/* <div className="form-control" id="customFile"> */}
                        <input type="file" name="file" className="form-control" id="customFile" onChange={this.onFileChange} />
                        {/* </div> */}
                    </Form>
                </Col>
                <Col md={4}>
                    <Form onSubmit={this.onSubmitFile}>
                        <Form.Group controlId="exampleForm.ControlSelect1">
                            <div className="form-group">
                                <button className="btn btn-primary" type="submit">Upload</button>
                            </div>
                        </Form.Group>
                    </Form>
                </Col>
            </Row >
        )
    }
}