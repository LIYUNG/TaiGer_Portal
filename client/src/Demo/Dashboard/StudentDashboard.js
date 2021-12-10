import React from "react";
import { Dropdown, DropdownButton } from "react-bootstrap";
import { Card, Col, Row, Table } from "react-bootstrap";
import avatar1 from "../../assets/images/user/avatar-1.jpg";
import EditAgentsSubpage from "./EditAgentsSubpage";
import EditEditorsSubpage from "./EditEditorsSubpage";
import EditProgramsSubpage from "./EditProgramsSubpage";
import EditFilesSubpage from "./EditFilesSubpage";

class StudentDashboard extends React.Component {
  render() {
    return (
      // Overview template 2
      <>
        <tbody>
          <tr>
            <td>
              {this.props.student.firstname_}
              {this.props.student.lastname_}
            </td>
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
