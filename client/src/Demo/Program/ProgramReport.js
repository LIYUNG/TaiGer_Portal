import React from 'react';
import { Button, Spinner, Card, Row } from 'react-bootstrap';
import {
  createProgramReport,
  deleteProgramTicket,
  getProgramTicket,
  updateProgramTicket
} from '../../api';
import { convertDate, spinner_style2 } from '../Utils/contants';
import ErrorPage from '../Utils/ErrorPage';
import ProgramReportModal from './ProgramReportModal';
import { NewlineText } from '../Utils/checking-functions';
import ProgramReportUpdateModal from './ProgramReportUpdateModal';
import ModalMain from '../Utils/ModalHandler/ModalMain';
import ProgramReportDeleteModal from './ProgramReportDeleteModal';

class ProgramReport extends React.Component {
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
    getProgramTicket('program', this.props.program_id).then(
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
  handleReportClick = () => {
    this.setState((state) => ({ ...state, isReport: !this.state.isReport }));
  };

  handleReportDeleteClick = (ticket) => {
    this.setState((state) => ({
      ...state,
      isReportDelete: !this.state.isReportDelete,
      ticket
    }));
  };

  handleReportUpdateClick = (ticket) => {
    this.setState((state) => ({
      ...state,
      isUpdateReport: !this.state.isUpdateReport,
      ticket
    }));
  };

  setReportModalHideDelete = () => {
    this.setState({
      isReport: false
    });
  };

  setReportDeleteModalHide = () => {
    this.setState({
      isReportDelete: false
    });
  };

  setReportUpdateModalHide = () => {
    this.setState({
      isUpdateReport: false
    });
  };
  handleChange = (e) => {
    this.setState({
      description: e.target.value
    });
  };

  submitProgramReport = (progrgam_id, description) => {
    createProgramReport(progrgam_id, description, 'program').then(
      (resp) => {
        const { success, data } = resp.data;
        const { status } = resp;
        if (success) {
          this.setState({
            isLoaded: true,
            isReport: false,
            success: success,
            tickets: [data, ...this.state.tickets],
            res_modal_status: status
          });
        } else {
          const { message } = resp.data;
          this.setState({
            isLoaded: true,
            res_modal_status: status,
            res_modal_message: message
          });
        }
      },
      (error) => {
        console.log(error);
        this.setState({
          isLoaded: true,
          isUpdateReport: false,
          isReport: false,
          res_modal_status: 500,
          res_modal_message: error.message
        });
      }
    );
  };

  submitProgramUpdateReport = (ticket_id, updatedTicket) => {
    console.log(updatedTicket);
    updateProgramTicket(ticket_id, updatedTicket).then(
      (resp) => {
        const { success, data } = resp.data;
        const { status } = resp;
        if (success) {
          const temp_tickets = [...this.state.tickets];
          let temp_ticket_idx = temp_tickets.findIndex(
            (temp_t) => temp_t._id.toString() === ticket_id
          );
          temp_tickets[temp_ticket_idx] = data;
          this.setState({
            isLoaded: true,
            isUpdateReport: false,
            isReport: false,
            success: success,
            tickets: temp_tickets,
            res_modal_status: status
          });
        } else {
          const { message } = resp.data;
          this.setState({
            isLoaded: true,
            isUpdateReport: false,
            isReport: false,
            res_modal_status: status,
            res_modal_message: message
          });
        }
      },
      (error) => {
        this.setState({
          isLoaded: true,
          isUpdateReport: false,
          isReport: false,
          res_modal_status: 500,
          res_modal_message: error.message
        });
      }
    );
  };

  submitProgramDeleteReport = (ticket_id) => {
    deleteProgramTicket(ticket_id).then(
      (resp) => {
        const { success, data } = resp.data;
        const { status } = resp;
        if (success) {
          const temp_tickets = this.state.tickets.filter(
            (ticket) => ticket._id.toString() !== ticket_id
          );
          this.setState({
            isLoaded: true,
            isReportDelete: false,
            success: success,
            tickets: temp_tickets,
            res_modal_status: status
          });
        } else {
          const { message } = resp.data;
          this.setState({
            isLoaded: true,
            isReportDelete: false,
            res_modal_status: status,
            res_modal_message: message
          });
        }
      },
      (error) => {
        this.setState({
          isLoaded: true,
          isReportDelete: false,
          res_modal_status: 500,
          res_modal_message: error.message
        });
      }
    );
  };

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
    const tickets = this.state.tickets.map((ticket, i) => (
      <Card key={i}>
        <Card.Body>
          <Button
            size="sm"
            onClick={() => this.handleReportUpdateClick(ticket)}
          >
            Update
          </Button>
          <Button
            size="sm"
            variant="danger"
            disabled={ticket.status === 'resolved'}
            onClick={() => this.handleReportDeleteClick(ticket)}
          >
            Delete
          </Button>
          <p>Description: {NewlineText({ text: ticket.description })}</p>
          <p>Status at: {ticket.status}</p>
          <p>Feedback: {NewlineText({ text: ticket.feedback })}</p>
          <p>updated at: {convertDate(ticket.updatedAt)}</p>
          <p>created at: {convertDate(ticket.createdAt)}</p>
        </Card.Body>
      </Card>
    ));
    return (
      <>
        <Row>
          <Button size="sm" onClick={() => this.handleReportClick()}>
            Report
          </Button>
        </Row>
        {tickets}
        {this.state.res_modal_status >= 400 && (
          <ModalMain
            ConfirmError={this.ConfirmError}
            res_modal_status={this.state.res_modal_status}
            res_modal_message={this.state.res_modal_message}
          />
        )}
        <ProgramReportModal
          isReport={this.state.isReport}
          setReportModalHideDelete={this.setReportModalHideDelete}
          uni_name={this.props.uni_name}
          program_name={this.props.program_name}
          submitProgramReport={this.submitProgramReport}
          program_id={this.props.program_id.toString()}
        />
        <ProgramReportDeleteModal
          isReportDelete={this.state.isReportDelete}
          setReportDeleteModalHide={this.setReportDeleteModalHide}
          ticket={this.state.ticket}
          uni_name={this.props.uni_name}
          program_name={this.props.program_name}
          submitProgramDeleteReport={this.submitProgramDeleteReport}
          program_id={this.props.program_id.toString()}
        />
        <ProgramReportUpdateModal
          isUpdateReport={this.state.isUpdateReport}
          setReportUpdateModalHide={this.setReportUpdateModalHide}
          ticket={this.state.ticket}
          uni_name={this.props.uni_name}
          program_name={this.props.program_name}
          submitProgramUpdateReport={this.submitProgramUpdateReport}
          program_id={this.props.program_id.toString()}
        />
      </>
    );
  }
}
export default ProgramReport;
