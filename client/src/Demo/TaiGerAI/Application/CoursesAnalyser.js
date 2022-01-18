import React, { Component } from "react";
import { Row, Col, Spinner } from "react-bootstrap";
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
    const style = {
      position: "fixed",
      top: "40%",
      left: "50%",
      transform: "translate(-50%, -50%)",
    };
    if (error) {
      return (
        <div>
          Error: your session is timeout! Please refresh the page and Login
        </div>
      );
    }
    if (!isLoaded) {
      return (
        <div style={style}>
          <Spinner animation="border" role="status">
            <span className="visually-hidden"></span>
          </Spinner>
        </div>
      );
    } else {
      return (
        <Aux>
          <Row>
            <Col>
              <UploadAndGenerate id="ToBeGenerated" />
            </Col>
          </Row>
        </Aux>
      );
    }
  }
}

export default CoursesAnalyser;
