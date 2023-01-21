import React from 'react';
import { Link } from 'react-router-dom';
import { IoCheckmarkCircle } from 'react-icons/io5';
import {
  AiFillQuestionCircle,
  AiFillCloseCircle,
  AiOutlineFieldTime
} from 'react-icons/ai';
import { BsDash } from 'react-icons/bs';

class StudentBaseDocumentsStatus extends React.Component {
  state = {
    student: this.props.student,
    student_id: '',
    docName: '',
    file: ''
  };

  render() {
    let keys2 = Object.keys(window.profile_list);
    let object_init = {};
    let object_message = {};
    let object_date_init = {};
    let object_time_init = {};
    for (let i = 0; i < keys2.length; i++) {
      object_init[keys2[i]] = 'missing';
      object_message[keys2[i]] = '';
      object_date_init[keys2[i]] = '';
      object_time_init[keys2[i]] = '';
    }

    if (this.props.student.profile) {
      for (let i = 0; i < this.props.student.profile.length; i++) {
        if (this.props.student.profile[i].status === 'uploaded') {
          object_init[this.props.student.profile[i].name] = 'uploaded';
        } else if (this.props.student.profile[i].status === 'accepted') {
          object_init[this.props.student.profile[i].name] = 'accepted';
        } else if (this.props.student.profile[i].status === 'rejected') {
          object_init[this.props.student.profile[i].name] = 'rejected';
        } else if (this.props.student.profile[i].status === 'notneeded') {
          object_init[this.props.student.profile[i].name] = 'notneeded';
        } else if (this.props.student.profile[i].status === 'missing') {
          object_init[this.props.student.profile[i].name] = 'missing';
        }
        object_message[this.props.student.profile[i].name] = this.props.student
          .profile[i].feedback
          ? this.props.student.profile[i].feedback
          : '';
        object_date_init[this.props.student.profile[i].name] = new Date(
          this.props.student.profile[i].updatedAt
        ).toLocaleDateString();
        object_time_init[this.props.student.profile[i].name] = new Date(
          this.props.student.profile[i].updatedAt
        ).toLocaleTimeString();
      }
    } else {
    }
    let profile_list_keys = Object.keys(window.profile_list);
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
        object_init[profile_list_keys[i]] === 'uploaded' ||
        object_init[profile_list_keys[i]] === 'rejected' ||
        object_init[profile_list_keys[i]] === 'missing'
      ) {
        current_style = style_missing;
        current_title = title_missing;
        break;
      }
    }
    file_information = profile_list_keys.map((k, i) => {
      if (object_init[k] === 'uploaded') {
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
      } else if (object_init[k] === 'accepted') {
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
      } else if (object_init[k] === 'rejected') {
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
      } else if (object_init[k] === 'notneeded') {
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
