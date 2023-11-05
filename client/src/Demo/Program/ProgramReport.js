import React from 'react';
import { Button, Spinner, Card, Row } from 'react-bootstrap';
import { createProgramReport, getProgramTickets } from '../../api';
import { spinner_style } from '../Utils/contants';
import ErrorPage from '../Utils/ErrorPage';
import ProgramReportModal from './ProgramReportModal';

class ProgramReport extends React.Component {
  state = {
    isReport: false,
    description: '',
    isLoaded: false,
    tickets: [],
    res_status: 0,
    res_modal_message: '',
    res_modal_status: 0
  };

  componentDidMount() {
    getProgramTickets('program', this.props.program_id).then(
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
  setReportModalHideDelete = () => {
    this.setState({
      isReport: false
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
        console.log(success);
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
      (error) => {}
    );
  };

  render() {
    const { res_status, isLoaded } = this.state;
    if (res_status >= 400) {
      return <ErrorPage res_status={res_status} />;
    }
    if (!isLoaded) {
      return (
        <div style={spinner_style}>
          <Spinner animation="border" role="status">
            <span className="visually-hidden"></span>
          </Spinner>
        </div>
      );
    }
    const tickets = this.state.tickets.map((ticket, i) => (
      <Card>
        <Card.Body>
          <p>Description: {ticket.description}</p>
          <p>Status at: {ticket.status}</p>
          <p>created at: {ticket.createdAt}</p>
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
        <ProgramReportModal
          isReport={this.state.isReport}
          setReportModalHideDelete={this.setReportModalHideDelete}
          uni_name={this.props.uni_name}
          program_name={this.props.program_name}
          submitProgramReport={this.submitProgramReport}
          program_id={this.props.program_id.toString()}
        />
      </>
    );
  }
}
export default ProgramReport;
