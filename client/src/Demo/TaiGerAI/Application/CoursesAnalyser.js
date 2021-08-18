import React, { Component } from "react";
import { Row, Col } from "react-bootstrap";
import Aux from "../../../hoc/_Aux";
import UploadAndGenerate from "../UploadAndGenerate";


class CoursesAnalyser extends Component {
  state = {
    error: null,
    isLoaded: false,
  };
  componentDidMount() {
    this.setState({
      isLoaded: true,
    });
  }

  render() {
    const { error, isLoaded } = this.state;
    if (error) {
      //TODO: put error page component for timeout
      localStorage.removeItem("token");
      return (
        <div>
          Error: your session is timeout! Please refresh the page and Login
        </div>
      );
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
        <Aux>
          <Row>
            <Col>
              <UploadAndGenerate
                id="ToBeGenerated"
              />
            </Col>
          </Row>
        </Aux>
      );
    }
  }
}

export default CoursesAnalyser;
