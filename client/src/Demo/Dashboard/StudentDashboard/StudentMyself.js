import React from "react";
import {
  AiFillCloseCircle,
  AiFillQuestionCircle,
  AiOutlineFieldTime,
} from "react-icons/ai";
import { IoCheckmarkCircle } from "react-icons/io5";
import avatar1 from "../../../assets/images/user/avatar-1.jpg";
import { uploadforstudent } from "../../../api";
import StudentDashboard from "./StudentDashboard";

class StudentMyself extends React.Component {
  state = {
    student: this.props.student,
  };


  render() {
    let studentDocOverview;
    let keys = Object.keys(this.props.documentlist2);
    let object_init = new Object();
    for (let i = 0; i < keys.length; i++) {
      object_init[keys[i]] = "missing";
    }

    if (this.state.student.profile) {
      for (let i = 0; i < this.state.student.profile.length; i++) {
        if (this.state.student.profile[i].status === "uploaded") {
          object_init[this.state.student.profile[i].name] = "uploaded";
        } else if (this.state.student.profile[i].status === "accepted") {
          object_init[this.state.student.profile[i].name] = "accepted";
        } else if (this.state.student.profile[i].status === "rejected") {
          object_init[this.state.student.profile[i].name] = "rejected";
        } else if (this.state.student.profile[i].status === "missing") {
          object_init[this.state.student.profile[i].name] = "missing";
        }
      }
    } else {
      console.log("no files");
    }
    studentDocOverview = keys.map((k, i) => {
      if (object_init[k] === "uploaded") {
        return (
          <td key={i}>
            <AiOutlineFieldTime
              size={24}
              color="orange"
              title="Uploaded successfully"
            />{" "}
          </td>
        );
      } else if (object_init[k] === "accepted") {
        return (
          <td key={i}>
            <IoCheckmarkCircle
              size={24}
              color="limegreen"
              title="Valid Document"
            />{" "}
          </td>
        );
      } else if (object_init[k] === "rejected") {
        return (
          <td key={i}>
            <AiFillCloseCircle size={24} color="red" title="Invalid Document" />{" "}
          </td>
        );
      } else {
        return (
          <td key={i}>
            <AiFillQuestionCircle
              size={24}
              color="lightgray"
              title="No Document uploaded"
            />{" "}
          </td>
        );
      }
    });
    return <StudentDashboard studentDocOverview={studentDocOverview} />;
  }
}

export default StudentMyself;
