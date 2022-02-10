import React from "react";
import { Dropdown, Row, Col, Spinner, Button, Card } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { getProgram } from "../../api";
import SingleProgramView from "./SingleProgramView";
import SingleProgramEdit from "./SingleProgramEdit";
class SingleProgram extends React.Component {
  state = {
    isLoaded: false,
    program: null,
    success: false,
    error: null,
    isEdit: false,
  };
  componentDidMount() {
    getProgram(this.props.match.params.programId).then(
      (resp) => {
        console.log(resp);
        const { data, success } = resp.data;
        if (success) {
          this.setState({
            isLoaded: true,
            program: data,
            success: success,
          });
        } else {
          alert(resp.data.message);
        }
      },
      (error) => {
        console.log(": " + error);
        this.setState({
          isLoaded: true,
          error: true,
        });
      }
    );
  }
  handleClick = () => {
    this.setState((state) => ({ ...state, isEdit: !this.state.isEdit }));
  };
  render() {
    const { isEdit, error, isLoaded, program } = this.state;

    if (error) {
      return (
        <div>
          Error: your session is timeout! Please refresh the page and Login
        </div>
      );
    }
    const style = {
      position: "fixed",
      top: "40%",
      left: "50%",
      transform: "translate(-50%, -50%)",
    };
    console.log(program);
    if (!isLoaded && !program) {
      return (
        <div style={style}>
          <Spinner animation="border" role="status">
            <span className="visually-hidden"></span>
          </Spinner>
        </div>
      );
    }
    console.log(program);
    if (this.state.isEdit) {
      return (
        <>
          <SingleProgramEdit
            program={program}
            error={error}
            isLoaded={isLoaded}
          />
          <Button size="sm" onClick={() => this.handleClick()}>
            Update
          </Button>
          <Button size="sm" onClick={() => this.handleClick()}>
            Cancel
          </Button>
        </>
      );
    } else {
      return (
        <>
          <SingleProgramView
            program={program}
            error={error}
            isLoaded={isLoaded}
          />
          <Button size="sm" onClick={() => this.handleClick()}>
            Edit
          </Button>
        </>
      );
    }
  }
}
export default SingleProgram;
