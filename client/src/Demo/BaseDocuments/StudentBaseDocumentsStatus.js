import React from 'react';
import { Link } from 'react-router-dom';
import { IoCheckmarkCircle } from 'react-icons/io5';
import {
  AiFillQuestionCircle,
  AiFillCloseCircle,
  AiOutlineFieldTime
} from 'react-icons/ai';
import { BsDash } from 'react-icons/bs';
import { profile_list } from '../Utils/contants';
import { DocumentStatus } from '../Utils/checking-functions';

class StudentBaseDocumentsStatus extends React.Component {
  state = {
    student: this.props.student,
    student_id: '',
    docName: '',
    file: ''
  };

  render() {
    let keys2 = Object.keys(profile_list);
    let object_init = {};
    keys2.forEach((key) => {
      object_init[key] = DocumentStatus.Missing;
    });

    if (this.props.student.profile) {
      for (let i = 0; i < this.props.student.profile.length; i++) {
        const { status, name, feedback, updatedAt } =
          this.props.student.profile[i];
        switch (status) {
          case DocumentStatus.Uploaded:
            object_init[name] = DocumentStatus.Uploaded;
            break;
          case DocumentStatus.Accepted:
            object_init[name] = DocumentStatus.Accepted;
            break;
          case DocumentStatus.Rejected:
            object_init[name] = DocumentStatus.Rejected;
            break;
          case DocumentStatus.NotNeeded:
            object_init[name] = DocumentStatus.NotNeeded;
            break;
          case DocumentStatus.Missing:
            object_init[name] = DocumentStatus.Missing;
            break;
        }
      }
    } else {
    }
    let profile_list_keys = Object.keys(profile_list);
    const style_ok = {
      background: 'green'
    };
    const title_ok = 'Complete';
    const style_missing = {
      background: 'red'
    };
    const title_missing = 'Incomplete';
    let current_style = style_ok;
    let current_title = title_ok;
    const student_profile_path =
      '/student-database/' + this.props.student._id + '/profile';
    var file_information;
    for (var i = 0; i < profile_list_keys.length; i++) {
      if (
        object_init[profile_list_keys[i]] === DocumentStatus.Uploaded ||
        object_init[profile_list_keys[i]] === DocumentStatus.Rejected ||
        object_init[profile_list_keys[i]] === DocumentStatus.Missing
      ) {
        current_style = style_missing;
        current_title = title_missing;
        break;
      }
    }
    file_information = profile_list_keys.map((k, i) => {
      if (object_init[k] === DocumentStatus.Uploaded) {
        return (
          <td key={i}>
            <Link
              to={student_profile_path}
              style={{ textDecoration: 'none' }}
              className="text-info"
            >
              <AiOutlineFieldTime
                size={24}
                color="orange"
                title="Uploaded successfully"
              />
            </Link>
          </td>
        );
      } else if (object_init[k] === DocumentStatus.Accepted) {
        return (
          <td key={i}>
            <Link
              to={student_profile_path}
              style={{ textDecoration: 'none' }}
              className="text-info"
            >
              <IoCheckmarkCircle
                size={24}
                color="limegreen"
                title="Valid Document"
              />
            </Link>
          </td>
        );
      } else if (object_init[k] === DocumentStatus.Rejected) {
        return (
          <td key={i}>
            <Link
              to={student_profile_path}
              style={{ textDecoration: 'none' }}
              className="text-info"
            >
              <AiFillCloseCircle
                size={24}
                color="red"
                title="Invalid Document"
              />
            </Link>
          </td>
        );
      } else if (object_init[k] === DocumentStatus.NotNeeded) {
        // TODO: render or hide?
        return (
          <td key={i}>
            <Link
              to={student_profile_path}
              style={{ textDecoration: 'none' }}
              className="text-info"
            >
              <BsDash size={24} color="lightgray" title="Not needed" />
            </Link>
          </td>
        );
      } else {
        return (
          <td key={i}>
            <Link
              to={student_profile_path}
              style={{ textDecoration: 'none' }}
              className="text-info"
            >
              <AiFillQuestionCircle
                size={24}
                color="lightgray"
                title="No Document uploaded"
              />
            </Link>
          </td>
        );
      }
    });

    return (
      <>
        <tr>
          <td style={current_style} title={current_title} className="long">
            <Link
              to={student_profile_path}
              style={{ textDecoration: 'none' }}
              className="text-light"
            >
              {this.props.student.firstname} {this.props.student.lastname}
            </Link>
          </td>
          <td>
            <Link
              to={student_profile_path}
              style={{ textDecoration: 'none' }}
              className="text-light"
            >
              {this.props.student.firstname} {this.props.student.lastname}
            </Link>
          </td>
          {file_information}
        </tr>
      </>
    );
  }
}

export default StudentBaseDocumentsStatus;
