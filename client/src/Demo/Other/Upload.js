// import React, { Component } from 'react';
// import { Row, Col } from 'react-bootstrap';

// import Aux from "../../hoc/_Aux";
// import Card from "../../App/components/MainCard";
import FilesUploadComponent from "../../App/components/files-upload-component";
import axios from 'axios';

import React from 'react';
import { Row, Col, Card, Form, Button } from 'react-bootstrap';

import Aux from "../../hoc/_Aux";

class UploadPage extends React.Component {
    constructor(props) {
        super(props);

        this.onFileChange = this.onFileChange.bind(this);
        this.onSubmitFile = this.onSubmitFile.bind(this);

        this.state = {
            error: null,
            file: '',
            isLoaded: false
        };
    }

    componentDidMount() {
        this.setState({ file: '' })
    }
    componentDidUpdate(prevProps, prevState) {
        if (this.state.isLoaded === false) {
            this.setState({
                isLoaded: true
            });
        }
    }
    onFileChange(e) {
        // console.log(e.target.files)
        // console.log(e.target.files[0])
        this.setState({
            file: e.target.files[0],

        })
    }

    onSubmitFile(e, id) {
        const formData = new FormData()
        const auth = localStorage.getItem('token');
        formData.append('file', this.state.file)
        console.log(id)
        axios.post("http://localhost:2000/upload/" + id, formData, {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + JSON.parse(auth)
            },
            // body: JSON.stringify()
        })
            .then(res => {
                // console.log(res)
                if (res.status === 200) {
                    alert('Upload success')
                    this.setState({
                        file: '',
                        isLoaded: false
                    })
                }

            },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error
                    });
                })
    }

    submitFile = (e, id) => {
        if (this.state.file === '') {
            e.preventDefault()
            alert('Please select file')
        } else {
            e.preventDefault()
            this.onSubmitFile(e, id)
        }
    };

    onDownloadFile(e, id) {
        e.preventDefault()
        const auth = localStorage.getItem('token');
        //TODO: replace the file name
        fetch('http://localhost:2000/upload/' + id + '/' + '1624664481232yu-hung_tsai_passport.pdf',
            {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/image',
                    'Authorization': 'Bearer ' + JSON.parse(auth)
                },
            }
        )
            .then(res => res.blob()) // TODO: handle the case when the file not existed
            .then((blob) => {
                const url = window.URL.createObjectURL(
                    new Blob([blob]),
                );
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute(
                    'download',
                    `1624664481232yu-hung_tsai_passport.pdf`, //TODO: replace file name
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
                    this.setState({
                        isLoaded: true,
                        error
                    });
                }
            )
    }
    render() {
        const { error, isLoaded } = this.state;
        if (error) {
            //TODO: put error page component for timeout
            localStorage.removeItem('token');
            return <div>Error: your session is timeout! Please refresh the page and Login</div>;
        } else if (!isLoaded) {
            return <div>Loading...</div>;
        } else {
            return (
                <Aux>
                    <Row>
                        <Col>
                            <Card>
                                <Card.Header>
                                    <Card.Title as="h5">Upload Your University Documets</Card.Title>
                                </Card.Header>
                                <Card.Body>
                                    <h5>Bachelor's Certificate</h5>
                                    <hr />
                                    <FilesUploadComponent
                                        onFileChange={this.onFileChange}
                                        submitFile={this.submitFile}
                                        onDownloadFile={this.onDownloadFile}
                                        id="bachelorCertificate"
                                        checkboxid="bachelorCertificateCheckbox"
                                    />
                                    <h5 className="mt-5">Bachelor's Transcript</h5>
                                    <hr />
                                    <FilesUploadComponent
                                        onFileChange={this.onFileChange}
                                        submitFile={this.submitFile}
                                        onDownloadFile={this.onDownloadFile}
                                        id="bachelorTranscript"
                                        checkboxid="bachelorTranscriptCheckbox"
                                    />
                                </Card.Body>
                            </Card>
                            <Card>
                                <Card.Header>
                                    <Card.Title as="h5">Upload Your Language Certificate</Card.Title>
                                </Card.Header>
                                <Card.Body>
                                    <h6>English: IELTS/TOEFL</h6>
                                    <hr />
                                    <FilesUploadComponent
                                        onFileChange={this.onFileChange}
                                        submitFile={this.submitFile}
                                        onDownloadFile={this.onDownloadFile}
                                        id="englishCertiifcate"
                                        checkboxid="englishCertiifcateCheckbox"
                                    />
                                    <h6 className="mt-5">German: TestDaF/DSH/Goethe B2</h6>
                                    <hr />
                                    <FilesUploadComponent
                                        onFileChange={this.onFileChange}
                                        submitFile={this.submitFile}
                                        onDownloadFile={this.onDownloadFile}
                                        id="germanCertiifcate"
                                        checkboxid="germanCertiifcateCheckbox"
                                    />
                                </Card.Body>
                            </Card>
                            <Card>
                                <Card.Header>
                                    <Card.Title as="h5">Upload Your High School Documets</Card.Title>
                                </Card.Header>
                                <Card.Body>
                                    <h5>High School Diploma</h5>
                                    <hr />
                                    <FilesUploadComponent
                                        onFileChange={this.onFileChange}
                                        submitFile={this.submitFile}
                                        onDownloadFile={this.onDownloadFile}
                                        id="highschoolDiploma"
                                        checkboxid="highschoolDiplomaCheckbox"
                                    />
                                    <h5 className="mt-5">High School Transcript</h5>
                                    <hr />
                                    <FilesUploadComponent
                                        onFileChange={this.onFileChange}
                                        submitFile={this.submitFile}
                                        onDownloadFile={this.onDownloadFile}
                                        id="highschoolTranscript"
                                        checkboxid="highschoolTranscriptCheckbox"
                                    />
                                    <h5 className="mt-5">University Entrance Examination</h5>
                                    <hr />
                                    <FilesUploadComponent
                                        onFileChange={this.onFileChange}
                                        submitFile={this.submitFile}
                                        onDownloadFile={this.onDownloadFile}
                                        id="universityEntranceExamination"
                                        checkboxid="universityEntranceExaminationCheckbox"
                                    />
                                    <Row>
                                        <Col>
                                            <Form inline>
                                                <Form.Group className="mb-2">
                                                    <Form.Label srOnly>Email</Form.Label>
                                                    <Form.Control plaintext readOnly defaultValue="email@example.com" />
                                                </Form.Group>
                                                <Form.Group className="mb-2 mr-5">
                                                    <Form.Label srOnly>Password</Form.Label>
                                                    <Form.Control type="password" placeholder="Password" />
                                                </Form.Group>
                                                <Form.Group>
                                                    <Button className="mb-0">Confirm Identity</Button>
                                                </Form.Group>
                                            </Form>
                                        </Col>
                                    </Row>
                                    <h3 className="mt-5">Checkboxes and Radios</h3>
                                    <Row>
                                        <Col md={6}>
                                            <h5 className="mt-5">Radios</h5>
                                            <hr />
                                            <Form.Group>
                                                <Form.Check
                                                    custom
                                                    type="radio"
                                                    label="Toggle this custom radio"
                                                    name="supportedRadios"
                                                    id="supportedRadio3"
                                                />
                                                <Form.Check
                                                    custom
                                                    type="radio"
                                                    label="Or toggle this other custom radio"
                                                    name="supportedRadios"
                                                    id="supportedRadio4"
                                                />
                                            </Form.Group>
                                            <h5 className="mt-3">Inline</h5>
                                            <hr />
                                            <Form.Group>
                                                <Form.Check
                                                    inline
                                                    custom
                                                    type="radio"
                                                    label="Toggle this custom radio"
                                                    name="supportedRadio"
                                                    id="supportedRadio21"
                                                />
                                                <Form.Check
                                                    inline
                                                    custom
                                                    type="radio"
                                                    label="Or toggle this other custom radio"
                                                    name="supportedRadio"
                                                    id="supportedRadio22"
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <h5 className="mt-5">Range</h5>
                                            <hr />
                                            <Form.Label htmlFor="customRange1">Example range</Form.Label>
                                            <input type="range" className="custom-range" defaultValue="22" id="customRange1" />
                                            <Form.Label htmlFor="customRange2">Example range</Form.Label>
                                            <input type="range" className="custom-range" min="0" defaultValue="3" max="5" id="customRange2" />
                                            <Form.Label htmlFor="customRange3">Example range</Form.Label>
                                            <input type="range" className="custom-range" min="0" defaultValue="1.5" max="5" step="0.5" id="customRange3" />
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                            {/* <Card>
                                <Card.Header>
                                    <Card.Title as="h5">Input Group</Card.Title>
                                </Card.Header>
                                <Card.Body>
                                    <Row>
                                        <Col md={12}>
                                            <InputGroup className="mb-3">
                                                <InputGroup.Prepend>
                                                    <InputGroup.Text id="basic-addon1">@</InputGroup.Text>
                                                </InputGroup.Prepend>
                                                <FormControl
                                                    placeholder="Username"
                                                    aria-label="Username"
                                                    aria-describedby="basic-addon1"
                                                />
                                            </InputGroup>
    
                                            <InputGroup className="mb-3">
                                                <FormControl
                                                    placeholder="Recipient's username"
                                                    aria-label="Recipient's username"
                                                    aria-describedby="basic-addon2"
                                                />
                                                <InputGroup.Append>
                                                    <InputGroup.Text id="basic-addon2">@example.com</InputGroup.Text>
                                                </InputGroup.Append>
                                            </InputGroup>
    
                                            <label htmlFor="basic-url">Your vanity URL</label>
                                            <InputGroup className="mb-3">
                                                <InputGroup.Prepend>
                                                    <InputGroup.Text id="basic-addon3">
                                                        https://example.com/users/
                                                    </InputGroup.Text>
                                                </InputGroup.Prepend>
                                                <FormControl id="basic-url" aria-describedby="basic-addon3" />
                                            </InputGroup>
    
                                            <InputGroup className="mb-3">
                                                <InputGroup.Prepend>
                                                    <InputGroup.Text>$</InputGroup.Text>
                                                </InputGroup.Prepend>
                                                <FormControl aria-label="Amount (to the nearest dollar)" />
                                                <InputGroup.Append>
                                                    <InputGroup.Text>.00</InputGroup.Text>
                                                </InputGroup.Append>
                                            </InputGroup>
    
                                            <InputGroup>
                                                <InputGroup.Prepend>
                                                    <InputGroup.Text>With textarea</InputGroup.Text>
                                                </InputGroup.Prepend>
                                                <FormControl as="textarea" aria-label="With textarea" />
                                            </InputGroup>
                                        </Col>
                                        <Col md={6}>
                                            <h5 className="mt-5">Sizing</h5>
                                            <hr/>
                                            <InputGroup size="sm" className="mb-3">
                                                <InputGroup.Prepend>
                                                    <InputGroup.Text id="inputGroup-sizing-sm">Small</InputGroup.Text>
                                                </InputGroup.Prepend>
                                                <FormControl aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
                                            </InputGroup>
                                            <br />
                                            <InputGroup className="mb-3">
                                                <InputGroup.Prepend>
                                                    <InputGroup.Text id="inputGroup-sizing-default">Default</InputGroup.Text>
                                                </InputGroup.Prepend>
                                                <FormControl
                                                    aria-label="Default"
                                                    aria-describedby="inputGroup-sizing-default"
                                                />
                                            </InputGroup>
                                            <br />
                                            <InputGroup size="lg">
                                                <InputGroup.Prepend>
                                                    <InputGroup.Text id="inputGroup-sizing-lg">Large</InputGroup.Text>
                                                </InputGroup.Prepend>
                                                <FormControl aria-label="Large" aria-describedby="inputGroup-sizing-sm" />
                                            </InputGroup>
                                        </Col>
                                        <Col md={6}>
                                            <h5 className="mt-5">Checkboxes and radios</h5>
                                            <hr/>
                                            <InputGroup className="mb-3">
                                                <InputGroup.Prepend>
                                                    <InputGroup.Checkbox aria-label="Checkbox for following text input" />
                                                </InputGroup.Prepend>
                                                <FormControl aria-label="Text input with checkbox" />
                                            </InputGroup>
                                            <InputGroup>
                                                <InputGroup.Prepend>
                                                    <InputGroup.Radio aria-label="Radio button for following text input" />
                                                </InputGroup.Prepend>
                                                <FormControl aria-label="Text input with radio button" />
                                            </InputGroup>
                                        </Col>
                                    </Row>
                                    <h5 className="mt-5">Button Addons</h5>
                                    <hr/>
                                    <Row>
                                        <Col md={6}>
                                            <InputGroup className="mb-3">
                                                <InputGroup.Prepend>
                                                    <Button>Button</Button>
                                                </InputGroup.Prepend>
                                                <FormControl aria-describedby="basic-addon1" />
                                            </InputGroup>
    
                                            <InputGroup className="mb-3">
                                                <FormControl
                                                    placeholder="Recipient's username"
                                                    aria-label="Recipient's username"
                                                    aria-describedby="basic-addon2"
                                                />
                                                <InputGroup.Append>
                                                    <Button>Button</Button>
                                                </InputGroup.Append>
                                            </InputGroup>
                                        </Col>
                                        <Col md={6}>
                                            <InputGroup className="mb-3">
                                                <InputGroup.Prepend>
                                                    <Button>Button</Button>
                                                    <Button variant="secondary">Button</Button>
                                                </InputGroup.Prepend>
                                                <FormControl aria-describedby="basic-addon1" />
                                            </InputGroup>
    
                                            <InputGroup className="mb-3">
                                                <FormControl
                                                    placeholder="Recipient's username"
                                                    aria-label="Recipient's username"
                                                    aria-describedby="basic-addon2"
                                                />
                                                <InputGroup.Append>
                                                    <Button variant="secondary">Button</Button>
                                                    <Button>Button</Button>
                                                </InputGroup.Append>
                                            </InputGroup>
                                        </Col>
                                        <Col md={6}>
                                            <h5 className="mt-5">Buttons With Dropdown</h5>
                                            <hr/>
                                            <InputGroup className="mb-3">
                                                <DropdownButton as={InputGroup.Prepend} title="Dropdown" id="input-group-dropdown-1">
                                                    <Dropdown.Item href="#">Action</Dropdown.Item>
                                                    <Dropdown.Item href="#">Another action</Dropdown.Item>
                                                    <Dropdown.Item href="#">Something else here</Dropdown.Item>
                                                    <Dropdown.Divider />
                                                    <Dropdown.Item href="#">Separated link</Dropdown.Item>
                                                </DropdownButton>
                                                <FormControl aria-describedby="basic-addon1" />
                                            </InputGroup>
    
                                            <InputGroup>
                                                <FormControl
                                                    placeholder="Recipient's username"
                                                    aria-label="Recipient's username"
                                                    aria-describedby="basic-addon2"
                                                />
    
                                                <DropdownButton as={InputGroup.Append} title="Dropdown" id="input-group-dropdown-2">
                                                    <Dropdown.Item href="#">Action</Dropdown.Item>
                                                    <Dropdown.Item href="#">Another action</Dropdown.Item>
                                                    <Dropdown.Item href="#">Something else here</Dropdown.Item>
                                                    <Dropdown.Divider />
                                                    <Dropdown.Item href="#">Separated link</Dropdown.Item>
                                                </DropdownButton>
                                            </InputGroup>
                                        </Col>
                                        <Col md={6}>
                                            <h5 className="mt-5">Segmented  Buttons</h5>
                                            <hr/>
                                            <InputGroup className="mb-3">
                                                <Dropdown as={InputGroup.Prepend}>
                                                    <Button variant="secondary">Action</Button>
                                                    <Dropdown.Toggle split variant="secondary" id="dropdown-split-basic-1" />
                                                    <Dropdown.Menu>
                                                        <Dropdown.Item hred="#/action-1">Action</Dropdown.Item>
                                                        <Dropdown.Item hred="#/action-2">Another action</Dropdown.Item>
                                                        <Dropdown.Item hred="#/action-3">Something else</Dropdown.Item>
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                                <FormControl aria-describedby="basic-addon1" />
                                            </InputGroup>
    
                                            <InputGroup>
                                                <FormControl
                                                    placeholder="Recipient's username"
                                                    aria-label="Recipient's username"
                                                    aria-describedby="basic-addon2"
                                                />
    
                                                <Dropdown as={InputGroup.Append}>
                                                    <Button variant="secondary">Action</Button>
                                                    <Dropdown.Toggle split variant="secondary" id="dropdown-split-basic-2" />
                                                    <Dropdown.Menu>
                                                        <Dropdown.Item hred="#/action-1">Action</Dropdown.Item>
                                                        <Dropdown.Item hred="#/action-2">Another action</Dropdown.Item>
                                                        <Dropdown.Item hred="#/action-3">Something else</Dropdown.Item>
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                            </InputGroup>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card> */}
                        </Col>
                    </Row>
                </Aux >
            );
        }

    }
}

export default UploadPage;
