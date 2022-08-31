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
        console.log(resp);
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
        console.log(": " + error);
        this.setState({
          isLoaded: true,
          error: true,
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
    console.log(this.state.students);
    return <></>;
  }
}
export default SingleProgram;
