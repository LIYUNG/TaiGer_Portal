import React from "react";
// import { Dropdown, DropdownButton } from "react-bootstrap";
// import { Card, Col, Row, Table } from "react-bootstrap";
// import avatar1 from "../../../assets/images/user/avatar-1.jpg";

class StudentDashboard extends React.Component {
  render() {
    return (
      // Overview template 2
      <>
        <tbody>
          <tr>
            {this.props.studentDocOverview}
          </tr>
        </tbody>
      </>
      //   </Card.Body>
      // </Card>
    );
  }
}

export default StudentDashboard;
