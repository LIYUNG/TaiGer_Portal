import React from 'react';
import { Link } from 'react-router-dom';
import { AiFillCheckCircle, AiFillQuestionCircle } from 'react-icons/ai';
import { IoCheckmarkCircle } from 'react-icons/io5';
// import { Card, Col, Row } from "react-bootstrap";
// import { Dropdown, DropdownButton } from "react-bootstrap";

class AgentReviewing extends React.Component {
  render() {
    let keys = Object.keys(window.profile_list);
    let object_init = {};
    for (let i = 0; i < keys.length; i++) {
      object_init[keys[i]] = 'missing';
    }

    if (this.props.student.profile) {
      for (let i = 0; i < this.props.student.profile.length; i++) {
        if (this.props.student.profile[i].status === 'uploaded') {
          object_init[this.props.student.profile[i].name] = 'uploaded';
        } else if (this.props.student.profile[i].status === 'accepted') {
          object_init[this.props.student.profile[i].name] = 'accepted';
        } else if (this.props.student.profile[i].status === 'rejected') {
          object_init[this.props.student.profile[i].name] = 'rejected';
        } else if (this.props.student.profile[i].status === 'missing') {
          object_init[this.props.student.profile[i].name] = 'missing';
        } else if (this.props.student.profile[i].status === 'notneeded') {
          object_init[this.props.student.profile[i].name] = 'notneeded';
        }
      }
    } else {
    }
    let isMissingBaseDocs = false;
    for (let i = 0; i < keys.length; i += 1) {
      if (
        object_init[keys[i]] !== 'accepted' &&
        object_init[keys[i]] !== 'notneeded' &&
        object_init[keys[i]] !== 'uploaded'
      ) {
        isMissingBaseDocs = true;
        break;
      }
    }

    let isNo_decided_program = false;
    for (let i = 0; i < keys.length; i += 1) {
      if (this.props.student.applications) {
      }
      for (let j = 0; j < this.props.student.applications.length; j += 1)
        if (
          !this.props.student.applications[j].decided ||
          (this.props.student.applications[j].decided !== undefined &&
            this.props.student.applications[j].decided === 'X')
        ) {
          isNo_decided_program = true;
          break;
        }
    }

    var no_decided_program =
      this.props.student.applications &&
      this.props.student.applications.map((application, i) => {
        if (
          !application.decided ||
          (application.decided !== undefined && application.decided === false)
        ) {
          return (
            <Link
              to={'/student-applications/' + this.props.student._id}
              className="text-info"
              key={i}
              style={{ textDecoration: 'none' }}
            >
              <p className="text-danger">
                {application.programId.school}
                {' - '}
                {application.programId.program_name}
              </p>
            </Link>
          );
        }
      });

    return (
      <>
        <tr className="my-0">
          {this.props.role !== 'Student' ? (
            <>
              <td>
                <Link
                  to={
                    '/student-database/' + this.props.student._id + '/profile'
                  }
                  className="text-info"
                  style={{ textDecoration: 'none' }}
                >
                  {this.props.student.firstname}
                  {' - '}
                  {this.props.student.lastname}
                </Link>
              </td>
              <td>
                <Link
                  to={
                    '/student-database/' + this.props.student._id + '/profile'
                  }
                  style={{ textDecoration: 'none' }}
                >
                  {isMissingBaseDocs ? (
                    <p className="text-warning">
                      <AiFillQuestionCircle
                        size={24}
                        color="lightgray"
                        title="incomplete"
                        className="mx-2"
                      />
                      incomplete
                    </p>
                  ) : (
                    <p className="text-warning">
                      <IoCheckmarkCircle
                        size={24}
                        color="limegreen"
                        title="complete"
                        className="mx-2"
                      />
                      complete
                    </p>
                  )}
                </Link>
              </td>
            </>
          ) : (
            <></>
          )}
          <td>
            <Link
              to={'/student-applications/' + this.props.student._id}
              style={{ textDecoration: 'none' }}
            >
              {isNo_decided_program ? (
                <p className="text-warning">
                  <AiFillQuestionCircle
                    size={24}
                    color="lightgray"
                    title="incomplete"
                    className="mx-2"
                  />
                  incomplete
                </p>
              ) : (
                <p className="text-warning">
                  <IoCheckmarkCircle
                    size={24}
                    color="limegreen"
                    title="complete"
                    className="mx-2"
                  />
                  complete
                </p>
              )}
            </Link>
          </td>
        </tr>
      </>
    );
  }
}

export default AgentReviewing;
