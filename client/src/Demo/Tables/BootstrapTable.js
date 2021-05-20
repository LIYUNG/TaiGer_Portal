import React from 'react';
import { Row, Col, Card, Table } from 'react-bootstrap';

import Aux from "../../hoc/_Aux";
// import axios from 'axios';

const program_list_API = 'http://localhost:2000/programlist';

class BootstrapTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            data: []
        };
    }
    componentDidMount() {
        const auth = localStorage.getItem('token');
        fetch(program_list_API,
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
                    this.setState({
                        isLoaded: true,
                        error
                    });
                }
            )
    }

    render() {
        const { error, isLoaded, data } = this.state;
        if (error) {
            localStorage.removeItem('token')
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Loading...</div>;
        } else {
            return (
                <Aux>
                    <Row>
                        <Col>
                            <Card>
                                <Card.Header>
                                    <Card.Title as="h5">Program List</Card.Title>
                                    <span className="d-block m-t-5">use bootstrap <code>Table</code> component</span>
                                </Card.Header>
                                <Card.Body>
                                    <Table responsive>
                                        <thead>
                                            <tr>
                                                <th>University</th>
                                                <th>Program</th>
                                                <th>TOEFL</th>
                                                <th>IELTS</th>
                                                <th>Degree</th>
                                                <th>GRE/GMAT</th>
                                                <th>Application Deadline</th>
                                            </tr>
                                        </thead>
                                        <tbody>

                                            {data.map(program => (
                                                <tr key={program._id}>
                                                    <th scope="row">{program.University}</th>
                                                    <td>{program.Program} </td>
                                                    <td>{program.TOEFL}</td>
                                                    <td>{program.IELTS}</td>
                                                    <td>{program.Degree}</td>
                                                    <td>{program.GREGMAT}</td>
                                                    <td>{program.Application_end_date}</td>
                                                </tr>
                                            ))}


                                            {/* <tr>
                                                <th scope="row">1</th>
                                                <td>Mark</td>
                                                <td>Otto</td>
                                                <td>@mdo</td>
                                            </tr> */}
                                        </tbody>
                                    </Table>
                                </Card.Body>
                            </Card>
                            {/* <Card>
                                <Card.Header>
                                    <Card.Title as="h5">Hover Table</Card.Title>
                                    <span className="d-block m-t-5">use props <code>hover</code> with <code>Table</code> component</span>
                                </Card.Header>
                                <Card.Body>
                                    <Table responsive hover>
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>First Name</th>
                                                <th>Last Name</th>
                                                <th>Username</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <th scope="row">1</th>
                                                <td>Mark</td>
                                                <td>Otto</td>
                                                <td>@mdo</td>
                                            </tr>
                                            <tr>
                                                <th scope="row">2</th>
                                                <td>Jacob</td>
                                                <td>Thornton</td>
                                                <td>@fat</td>
                                            </tr>
                                            <tr>
                                                <th scope="row">3</th>
                                                <td>Larry</td>
                                                <td>the Bird</td>
                                                <td>@twitter</td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                </Card.Body>
                            </Card>
                            <Card>
                                <Card.Header>
                                    <Card.Title as="h5">Striped Table</Card.Title>
                                    <span className="d-block m-t-5">use props <code>striped</code> with <code>Table</code> component</span>
                                </Card.Header>
                                <Card.Body>
                                    <Table striped responsive>
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>First Name</th>
                                                <th>Last Name</th>
                                                <th>Username</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <th scope="row">1</th>
                                                <td>Mark</td>
                                                <td>Otto</td>
                                                <td>@mdo</td>
                                            </tr>
                                            <tr>
                                                <th scope="row">2</th>
                                                <td>Jacob</td>
                                                <td>Thornton</td>
                                                <td>@fat</td>
                                            </tr>
                                            <tr>
                                                <th scope="row">3</th>
                                                <td>Larry</td>
                                                <td>the Bird</td>
                                                <td>@twitter</td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                </Card.Body>
                            </Card> */}
                        </Col>
                    </Row>
                </Aux>
            )
        }
    }
}

export default BootstrapTable;