import React from "react";
// import { FaBeer } from 'react-icons/fa';
import {
  AiOutlineLoading3Quarters,
  AiOutlineCheck,
  AiOutlineClose,
  AiOutlineStop,
} from "react-icons/ai";
import {
  Dropdown,
  DropdownButton,
} from "react-bootstrap";
import avatar1 from "../../assets/images/user/avatar-1.jpg";

class EditableStudentlist extends React.Component {
  render() {
    let studentDocOverview;
    if (this.props.student.uploadedDocs_) {
      studentDocOverview = this.props.documentslist.map((doc, i) => {
        if (
          this.props.student.uploadedDocs_[doc.prop] &&
          this.props.student.uploadedDocs_[doc.prop].uploadStatus_ === "uploaded"
        ) {
          return (
            <p className="m-0" key={i}>
              {" "}
              <AiOutlineLoading3Quarters /> {doc.name} :{" "}
              {this.props.student.uploadedDocs_[doc.prop].uploadStatus_}
            </p>
          );
        } else if (
          this.props.student.uploadedDocs_[doc.prop] &&
          this.props.student.uploadedDocs_[doc.prop].uploadStatus_ === "checked"
        ) {
          return (
            <p className="m-0" key={i}>
              <AiOutlineCheck /> {doc.name} :{" "}
              {this.props.student.uploadedDocs_[doc.prop].uploadStatus_}
            </p>
          );
        } else if (
          this.props.student.uploadedDocs_[doc.prop] &&
          this.props.student.uploadedDocs_[doc.prop].uploadStatus_ === "unaccepted"
        ) {
          return (
            <p className="m-0" key={i}>
              <AiOutlineStop /> {doc.name} :{" "}
              {this.props.student.uploadedDocs_[doc.prop].uploadStatus_}
            </p>
          );
        } else {
          return (
            <p className="m-0" key={i}>
              <b>
                <AiOutlineClose /> {doc.name}{" "}
              </b>
            </p>
          );
        }
      });
    } else {
      studentDocOverview = <p>So far no uploaded file!</p>;
    }
    if (this.props.role === "Agent" || this.props.role === "Editor" || this.props.role === "Admin") {
      return (
        <tr key={this.props.student._id}>
          <>
            <td>
              <img
                className="rounded-circle"
                style={{ width: "40px" }}
                src={avatar1}
                alt="activity-user"
              />
            </td>
            <td>
              <h6 className="mb-1">
                {this.props.student.firstname_} {this.props.student.lastname_}
              </h6>
              <p className="m-1">{this.props.student.emailaddress_}</p>
              <h6 className="m-0">Document status</h6>
              {studentDocOverview}
            </td>
            <td>
              <h5>Agent:</h5>
              {this.props.student.agent_.map((agent, i) => (
                <p className="m-0" key={i}>
                  {agent}
                </p>
              ))}
              <h5>Editor:</h5>
              {this.props.student.editor_.map((editor, i) => (
                <p className="m-0" key={i}>
                  {editor}
                </p>
              ))}
            </td>
            <td>
              <h5>Programs:</h5>
              {this.props.student.applying_program_.map((program, i) => (
                <h6 key={i}>
                  {program.University_} {program.Program_}{" "}
                </h6>
              ))}
            </td>
            <th>
              <DropdownButton
                size="sm"
                title="Option"
                variant="primary"
                id={`dropdown-variants-${this.props.student._id}`}
                key={this.props.student._id}
              >
                <Dropdown.Item
                  eventKey="1"
                  onSelect={() => this.props.startEditingAgent(this.props.i)}
                >
                  Edit Agent
                </Dropdown.Item>
                <Dropdown.Item
                  eventKey="2"
                  onSelect={() => this.props.startEditingEditor(this.props.i)}
                >
                  Edit Editor
                </Dropdown.Item>
                <Dropdown.Item
                  eventKey="3"
                  onSelect={() => this.props.startEditingProgram(this.props.i)}
                >
                  Edit Program
                </Dropdown.Item>
                <Dropdown.Item
                  eventKey="4"
                  onSelect={() => this.props.startUploadfile(this.props.i)}
                >
                  Edit File Status
                </Dropdown.Item>
              </DropdownButton>
            </th>
            {/* <Row>
                    <h4>{this.props.student._id}</h4>
                </Row> */}
          </>
        </tr>
      );
    } else if (this.props.role === "Student") {
      return (
        <tr key={this.props.student._id}>
          <>
            <td>
              <img
                className="rounded-circle"
                style={{ width: "40px" }}
                src={avatar1}
                alt="activity-user"
              />
            </td>
            <td>
              <h6 className="mb-1">
                {this.props.student.firstname_} {this.props.student.lastname_}
              </h6>
              <p className="m-1">{this.props.student.emailaddress_}</p>
              <h6 className="m-0">Document status</h6>
              {studentDocOverview}
            </td>
            <td>
              <h5>Agent:</h5>
              {this.props.student.agent_.map((agent, i) => (
                <p className="m-0" key={i}>
                  {agent}
                </p>
              ))}
              <h5>Editor:</h5>
              {this.props.student.editor_.map((editor, i) => (
                <p className="m-0" key={i}>
                  {editor}
                </p>
              ))}
            </td>
            <td>
              <h5>Programs:</h5>
              {this.props.student.applying_program_.map((program, i) => (
                <h6 key={i}>
                  {program.University_} {program.Program_}{" "}
                </h6>
              ))}
            </td>
          </>
        </tr>
      );
    } else {
      return (
        <tr key={this.props.student._id}>
          <>
            <td>
              <img
                className="rounded-circle"
                style={{ width: "40px" }}
                src={avatar1}
                alt="activity-user"
              />
            </td>
            <td>
              <h6 className="mb-1">
                {this.props.student.firstname_} {this.props.student.lastname_}
              </h6>
              <p className="m-1">{this.props.student.emailaddress_}</p>
              <h6 className="m-0">Document status</h6>
              {studentDocOverview}
            </td>
            <td>
              <h5>Agent:</h5>
              {this.props.student.agent_.map((agent, i) => (
                <p className="m-0" key={this.props.i}>
                  {agent}
                </p>
              ))}
              <h5>Editor:</h5>
              {this.props.student.editor_.map((editor, i) => (
                <p className="m-0" key={this.props.i}>
                  {editor}
                </p>
              ))}
            </td>
            <td>
              <h5>Programs:</h5>
              {this.props.student.applying_program_.map((program, i) => (
                <h6 key={this.props.i}>
                  {program.University_} {program.Program_}{" "}
                </h6>
              ))}
            </td>
          </>
        </tr>
      );
    }
  }
}

export default EditableStudentlist;
