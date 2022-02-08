import React from "react";
// import { AiFillCloseCircle, AiFillQuestionCircle } from "react-icons/ai";
// import { IoCheckmarkCircle } from "react-icons/io5";
// import { Card, Col, Row } from "react-bootstrap";
// import { Dropdown, DropdownButton } from "react-bootstrap";
// import avatar1 from "../../../assets/images/user/avatar-1.jpg";
// import { uploadforstudent } from "../../../api";


class AdminTodoList extends React.Component {
  render() {

    return (
      <>
        <tbody>
          <tr>
            <td>
              <h5>
                {this.props.student.firstname}, {this.props.student.lastname}
              </h5>
            </td>
          </tr>
        </tbody>
      </>
    );
  }
}

export default AdminTodoList;
