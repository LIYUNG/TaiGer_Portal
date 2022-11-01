import React from 'react';
import { Spinner, Button } from 'react-bootstrap';
// import { useParams } from "react-router-dom";
import { getProgram } from '../../api';
import SingleProgramView from './SingleProgramView';
import SingleProgramEdit from './SingleProgramEdit';
import TimeOutErrors from '../Utils/TimeOutErrors';
import UnauthorizedError from '../Utils/UnauthorizedError';
import { updateProgram } from '../../api';
class SingleProgram extends React.Component {
  state = {
    isLoaded: false,
    program: null,
    success: false,
    error: null,
    unauthorizederror: null,
    unauthorizederror: null,
    isEdit: false
  };
  componentDidMount() {
    getProgram(this.props.match.params.programId).then(
      (resp) => {
        const { data, success } = resp.data;
        if (success) {
          this.setState({
            isLoaded: true,
            program: data,
            success: success
          });
        } else {
          if (resp.status === 401 || resp.status === 500) {
            this.setState({ isLoaded: true, timeouterror: true });
          } else if (resp.status === 403 || resp.status === 400) {
            this.setState({
              isLoaded: true,
              unauthorizederror: true
            });
          }
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
        if (success) {
          this.setState({
            isLoaded: true,
            program: data,
            success: success,
            isEdit: !this.state.isEdit
          });
        } else {
          if (resp.status === 401 || resp.status === 500) {
            this.setState({ isLoaded: true, timeouterror: true });
          } else if (resp.status === 403) {
            this.setState({
              isLoaded: true,
              unauthorizederror: true
            });
          }
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
    const { unauthorizederror, timeouterror, error, program, isLoaded } =
      this.state;

    if (timeouterror) {
      return (
        <div>
          <TimeOutErrors />
        </div>
      );
    }
    if (unauthorizederror) {
      return (
        <div>
          <UnauthorizedError />
        </div>
      );
    }
    const style = {
      position: 'fixed',
      top: '40%',
      left: '50%',
      transform: 'translate(-50%, -50%)'
    };
    if (!isLoaded && !program) {
      return (
        <div style={style}>
          <Spinner animation="border" role="status">
            <span className="visually-hidden"></span>
          </Spinner>
        </div>
      );
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
