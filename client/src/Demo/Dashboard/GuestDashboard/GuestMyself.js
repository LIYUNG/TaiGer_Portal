import React from "react";
import { Col, Row } from "react-bootstrap";
import GuestDashboard from "./GuestDashboard";

class GuestMyself extends React.Component {
  state = {
    student: this.props.student,
    file: "",
  };

  render() {
    
    return (
      <Row>
        <Col sm={12}>
          <GuestDashboard
            role={this.props.role}
          />
        </Col>
      </Row>
    );

    // }
  }
}

export default GuestMyself;
