import React from "react";
// import { AiFillCloseCircle, AiFillQuestionCircle } from "react-icons/ai";
// import { IoCheckmarkCircle } from "react-icons/io5";
// import { Card, Col, Row } from "react-bootstrap";
// import { Dropdown, DropdownButton } from "react-bootstrap";
// import avatar1 from "../../../assets/images/user/avatar-1.jpg";
// import { uploadforstudent } from "../../../api";


class AdminTodoList extends React.Component {
  render() {
    // let applying_universit;
    // let applying_program;
    // let application_deadline;
    // if (this.props.student.applications) {
    //   applying_universit = this.props.student.applications.map(
    //     (application) => (
    //       <>
    //         <h5 className="mb-1">{application.programId.University_}</h5>
    //       </>
    //     )
    //   );
    // } else {
    //   applying_universit = (
    //     <tr>
    //       <td>
    //         <h4 className="mb-1"> No Program</h4>
    //       </td>
    //     </tr>
    //   );
    // }

    // if (this.props.student.applications) {
    //   applying_program = this.props.student.applications.map((application) => (
    //     <>
    //       <h5 className="mb-1">{application.programId.Program_}</h5>
    //     </>
    //   ));
    // } else {
    //   applying_program = (
    //     <tr>
    //       <td>
    //         <h4 className="mb-1"> No Program</h4>
    //       </td>
    //     </tr>
    //   );
    // }

    // if (this.props.student.applications) {
    //   application_deadline = this.props.student.applications.map(
    //     (application) => (
    //       <>
    //         <h5 className="mb-1">
    //           {application.programId.Application_end_date_}
    //         </h5>
    //       </>
    //     )
    //   );
    // } else {
    //   application_deadline = (
    //     <tr>
    //       <td>
    //         <h4 className="mb-1"> No Program</h4>
    //       </td>
    //     </tr>
    //   );
    // }

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
