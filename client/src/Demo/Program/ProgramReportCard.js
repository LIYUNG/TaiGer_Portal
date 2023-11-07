import React from 'react';
import { Spinner, Row, Col, Card } from 'react-bootstrap';
import { getProgramTickets } from '../../api';
import { convertDate, spinner_style, spinner_style2 } from '../Utils/contants';
import ErrorPage from '../Utils/ErrorPage';
import { NewlineText } from '../Utils/checking-functions';

import { Table } from 'react-bootstrap';
import { BsExclamationTriangle } from 'react-icons/bs';
import { Link } from 'react-router-dom';

class ProgramReportCard extends React.Component {
  state = {
    isReport: false,
    isReportDelete: false,
    isUpdateReport: false,
    description: '',
    isLoaded: false,
    tickets: [],
    ticket: {},
    res_status: 0,
    res_modal_message: '',
    res_modal_status: 0
  };

  componentDidMount() {
    getProgramTickets('program', 'open').then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        if (success) {
          this.setState({
            isLoaded: true,
            tickets: data,
            success: success,
            res_status: status
          });
        } else {
          this.setState({
            isLoaded: true,
            res_status: status
          });
        }
      },
      (error) => {
        this.setState((state) => ({
          ...state,
          isLoaded: true,
          error,
          res_status: 500
        }));
      }
    );
  }

  ConfirmError = () => {
    this.setState((state) => ({
      ...state,
      res_modal_status: 0,
      res_modal_message: ''
    }));
  };
  render() {
    const { res_status, isLoaded } = this.state;
    if (res_status >= 400) {
      return <ErrorPage res_status={res_status} />;
    }
    if (!isLoaded) {
      return (
        <div style={spinner_style2}>
          <Spinner animation="border" role="status">
            <span className="visually-hidden"></span>
          </Spinner>
        </div>
      );
    }
    if (!this.state.tickets || this.state.tickets?.length === 0) {
      return <></>;
    }

    const tickets = this.state.tickets.map((ticket, i) => (
      <tr key={i}>
        <td>
          <Link
            to={`/programs/${ticket.program_id?._id.toString()}`}
            style={{ textDecoration: 'none' }}
            className="text-info"
          >
            {i + 1}.
          </Link>
        </td>
        <td>
          <Link
            to={`/programs/${ticket.program_id?._id.toString()}`}
            style={{ textDecoration: 'none' }}
            className="text-info"
            title={`${ticket.program_id?.school} - ${ticket.program_id?.program_name}`}
          >
            {`${ticket.program_id?.school} - ${ticket.program_id?.program_name}`.substring(
              0,
              30
            )}
            {`...`}
          </Link>
        </td>
        <td>
          <Link
            to={`/programs/${ticket.program_id?._id.toString()}`}
            style={{ textDecoration: 'none' }}
            className="text-info"
            title={ticket.description}
          >
            {`${ticket.description}`.substring(0, 50)}
            {ticket.description?.length > 50 ? ` ...` : ''}
          </Link>
        </td>
      </tr>
    ));
    return (
      <>
        <Col md={6}>
          <Card
            className="my-2 mx-0 card-with-scroll"
            bg={'danger'}
            text={'light'}
          >
            <Card.Header className="py-0 px-0 " bg={'danger'}>
              <Card.Title className="my-2 mx-2 text-light" as={'h5'}>
                <BsExclamationTriangle size={18} /> Program Update Request
              </Card.Title>
            </Card.Header>
            <Card.Body className="py-0 px-0 card-scrollable-body">
              <Table
                bordered
                hover
                className="my-0 mx-0"
                variant="dark"
                text="light"
                size="sm"
              >
                <thead>
                  <tr>
                    <th>idx</th>
                    <th>program</th>
                    <th>description</th>
                  </tr>
                </thead>
                <tbody>{tickets}</tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </>
    );
  }
}
export default ProgramReportCard;
