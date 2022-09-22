import React from 'react';
import { Link } from 'react-router-dom';
import { Col, Form, Button, Modal, Spinner } from 'react-bootstrap';
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
import NewBaseFileUploaded from './NewBaseFileUploaded';

class NewBaseFilesUploaded extends React.Component {
  state = {
    student: this.props.student
  };

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
    var to_be_checked_profiles = keys.map((Doc_key, i) => {
      if (object_init[Doc_key] === 'uploaded') {
        return (
          <NewBaseFileUploaded
            onUpdateProfileFilefromstudent={
              this.props.onUpdateProfileFilefromstudent
            }
            isLoaded={this.props.isLoaded}
            Doc_key={Doc_key}
            student={this.props.student}
          />
        );
      }
    });

    return <>{to_be_checked_profiles}</>;
  }
}

export default NewBaseFilesUploaded;
