import React from "react";
import { Spinner } from "react-bootstrap";
import { getArchivStudent } from "../../api";
class SingleProgram extends React.Component {
  state = {
    isLoaded: false,
    student: "",
    success: false,
    error: null,
  };
  componentDidMount() {
    getArchivStudent().then(
      (resp) => {
        const { data, success } = resp.data;
        if (success) {
          this.setState({
            isLoaded: true,
            student: data,
            success: success,
          });
        } else {
          alert(resp.data.message);
        }
      },
      (error) => {
        this.setState({
          isLoaded: true,
          error
        });
      }
    );
  }
  render() {
    const { error, isLoaded } = this.state;

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
    if (!isLoaded && !this.state.student) {
      return (
        <div style={style}>
          <Spinner animation="border" role="status">
            <span className="visually-hidden"></span>
          </Spinner>
        </div>
      );
    }
    return <></>;
  }
}
export default SingleProgram;
