import React from 'react';
import { Link } from 'react-router-dom';
import {
  AiFillCloseCircle,
  AiOutlineLoading3Quarters,
  AiFillQuestionCircle,
  AiOutlineUndo
} from 'react-icons/ai';
// import { AiFillCloseCircle, AiFillQuestionCircle } from "react-icons/ai";
// import { IoCheckmarkCircle } from "react-icons/io5";
// import { Card, Col, Row } from "react-bootstrap";
// import { Dropdown, DropdownButton } from "react-bootstrap";

class AgentReviewing_StudentView extends React.Component {
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
    var to_be_checked_profiles = keys.map((key, i) => {
      if (object_init[key] === 'uploaded') {
        return (
          <h6 key={i}>
            {' '}
            <AiOutlineLoading3Quarters
              size={18}
              color="lightred"
              title="No Document uploaded"
            />{' '}
            {key.replace(/_/g, ' ')}
          </h6>
        );
      }
    });
    var missing_profiles = keys.map((key, i) => {
      if (
        object_init[key] !== 'accepted' &&
        object_init[key] !== 'notneeded' &&
        object_init[key] !== 'uploaded'
      ) {
        return (
          <h6 key={i}>
            {' '}
            <AiFillQuestionCircle
              size={18}
              color="lightgray"
              title="No Document uploaded"
            />{' '}
            {key.replace(/_/g, ' ')}
          </h6>
        );
      }
    });
    var to_be_checked_profiles = keys.map((key, i) => {
      if (object_init[key] === 'uploaded') {
        return (
          <h6 key={i}>
            {' '}
            <AiOutlineLoading3Quarters
              size={18}
              color="lightred"
              title="Under agent's check"
            />{' '}
            <Link
              to={'/student-database/' + this.props.student._id + '/profile'}
              style={{ textDecoration: 'none' }}
            >
              {key.replace(/_/g, ' ')}
            </Link>
          </h6>
        );
      }
    });
    var no_decided_program =
      this.props.student.applications &&
      this.props.student.applications.map((application, i) => {
        if (
          !application.decided ||
          (application.decided !== undefined && application.decided === false)
        ) {
          return (
            <h6 key={i}>
              {application.programId.school}
              {' - '}
              {application.programId.program_name}
            </h6>
          );
        }
      });

    return (
      <>
        <tr>
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
              <td>{missing_profiles}</td>
            </>
          ) : (
            <></>
          )}
          <td>{to_be_checked_profiles}</td>
          <td>{no_decided_program}</td>
        </tr>
      </>
    );
  }
}

export default AgentReviewing_StudentView;