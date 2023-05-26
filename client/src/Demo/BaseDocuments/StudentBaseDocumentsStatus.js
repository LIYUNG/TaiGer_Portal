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
      object_init[key] = 'missing';
    });

    if (this.props.student.profile) {
      for (let i = 0; i < this.props.student.profile.length; i++) {
        const { status, name, feedback, updatedAt } =
          this.props.student.profile[i];
        switch (status) {
          case 'uploaded':
            object_init[name] = 'uploaded';
            break;
          case 'accepted':
            object_init[name] = 'accepted';
            break;
          case 'rejected':
            object_init[name] = 'rejected';
            break;
          case 'notneeded':
            object_init[name] = 'notneeded';
            break;
          case 'missing':
            object_init[name] = 'missing';
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
