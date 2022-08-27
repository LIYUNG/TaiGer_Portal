import React from "react";
import { AiFillCloseCircle, AiFillQuestionCircle } from "react-icons/ai";
import { IoCheckmarkCircle } from "react-icons/io5";
// import avatar1 from "../../../assets/images/user/avatar-1.jpg";
import { Col, Row } from "react-bootstrap";

import { uploadforstudent } from "../../../api";
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
