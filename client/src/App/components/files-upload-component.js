import React, { Component } from 'react';
import { Row, Col, Form } from 'react-bootstrap';
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

    onDownloadFile(e) {
        e.preventDefault()
        const auth = localStorage.getItem('token');
        //TODO: replace the file name
        fetch('http://localhost:2000/upload/dd-ddd.png',
            {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/image',
                    'Authorization': 'Bearer ' + JSON.parse(auth)
                },
            }
        )
            .then(res => res.blob())
            .then((blob) => {
                const url = window.URL.createObjectURL(
                    new Blob([blob]),
                );
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute(
                    'download',
                    `FileName.png`,
                );
                // Append to html link element page
                document.body.appendChild(link);

                // Start download
                link.click();

                // Clean up and remove the link
                link.parentNode.removeChild(link);
            },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    console.log(error);
                    console.log('Problem while getting document');
                }
            )
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
                    <Form onSubmit={this.onDownloadFile}>
                        <Form.Group controlId="exampleForm.ControlSelect1">
                            <div className="form-group">
                                <button className="btn btn-primary" type="submit">Download</button>
                            </div>
                        </Form.Group>
                    </Form>
                </Col>
            </Row >
        )
    }
}