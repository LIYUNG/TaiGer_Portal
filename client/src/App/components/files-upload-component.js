import React, { Component, useRef} from 'react';
import { Row, Col, Form } from 'react-bootstrap';

export default class FilesUploadComponent extends Component {

    render() {
        // const ref = useRef();
        // const reset = () => {
        //     ref.current.value = "";
        //   };
        return (
            <Row>
                <Col md={1}>
                    <Form>
                        <Form.Group>
                            <Form.Check
                                custom
                                type="checkbox"
                                id={this.props.checkboxid}
                                label="status"
                            />
                        </Form.Group>
                    </Form>
                </Col>
                <Col md={6}>
                    <Form onChange={e => this.props.onFileChange(e)} onClick={e => (e.target.value = null)}>
                        <Form.File id={this.props.id}>
                            {/* <Form.File.Label>Regular file input</Form.File.Label> */}
                            <Form.File.Input />
                        </Form.File>
                        {/* <Form.File
                            id={this.props.id}
                            label="Custom file input"
                            custom
                            onChange={e => this.props.onFileChange(e)}
                        /> */}
                        {/* <input type="file" name="file" className="form-control" id={this.props.id} onChange={e => this.props.onFileChange(e)} /> */}
                    </Form>
                </Col>
                <Col md={2}>
                    <Form onSubmit={(e) => this.props.submitFile(e, this.props.id)} >
                        <Form.Group controlId="exampleForm.ControlSelect1">
                            <div className="form-group">
                                <button className="btn btn-primary" type="submit">Upload</button>
                            </div>
                        </Form.Group>
                    </Form>
                </Col>
                <Col md={2}>
                    <Form onSubmit={(e) => this.props.onDownloadFile(e, this.props.id)}>
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