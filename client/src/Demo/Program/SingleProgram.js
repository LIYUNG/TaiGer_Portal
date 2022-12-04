import React from 'react';
import { Spinner, Button } from 'react-bootstrap';
import { getProgram, updateProgram } from '../../api';
import SingleProgramView from './SingleProgramView';
import SingleProgramEdit from './SingleProgramEdit';
import { spinner_style } from '../Utils/contants';
import ErrorPage from '../Utils/ErrorPage';

class SingleProgram extends React.Component {
  state = {
    isLoaded: false,
    program: null,
    success: false,
    error: null,
    isEdit: false,
    res_status: 0
  };
  componentDidMount() {
    getProgram(this.props.match.params.programId).then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        if (success) {
          this.setState({
            isLoaded: true,
            program: data,
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
        this.setState({
          isLoaded: true,
          error: true
        });
      }
    );
  }

  handleSubmit_Program = (program) => {
    updateProgram(program).then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        if (success) {
          this.setState({
            isLoaded: true,
            program: data,
            success: success,
            isEdit: !this.state.isEdit,
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
        this.setState({
          isLoaded: true,
          error: true
        });
      }
    );
  };

  handleClick = () => {
    this.setState((state) => ({ ...state, isEdit: !this.state.isEdit }));
  };

  render() {
    const { res_status, program, isLoaded } = this.state;

    if (!isLoaded && !program) {
      return (
        <div style={spinner_style}>
          <Spinner animation="border" role="status">
            <span className="visually-hidden"></span>
          </Spinner>
        </div>
      );
    }

    if (res_status >= 400) {
      return <ErrorPage res_status={res_status} />;
    }

    if (this.state.isEdit) {
      return (
        <>
          <SingleProgramEdit
            program={program}
            isLoaded={isLoaded}
            handleSubmit_Program={this.handleSubmit_Program}
            handleClick={this.handleClick}
          />
        </>
      );
    } else {
      return (
        <>
          <SingleProgramView
            program={program}
            isLoaded={isLoaded}
            role={this.props.user.role}
          />
          {(this.props.user.role === 'Admin' ||
            this.props.user.role === 'Agent') && (
            <Button size="sm" onClick={() => this.handleClick()}>
              Edit
            </Button>
          )}
        </>
      );
    }
  }
}
export default SingleProgram;
