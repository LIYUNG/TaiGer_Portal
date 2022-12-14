import React from 'react';
import {
  AiFillCloseCircle,
  AiFillQuestionCircle,
  AiOutlineFieldTime
} from 'react-icons/ai';
import { IoCheckmarkCircle } from 'react-icons/io5';
import { BsDash } from 'react-icons/bs';

class StudentMyself extends React.Component {
  state = {
    student: this.props.student
  };

  render() {
    let studentDocOverview;
    let documentlist2_keys = Object.keys(window.profile_list);
    let object_init = {};
    for (let i = 0; i < documentlist2_keys.length; i++) {
      object_init[documentlist2_keys[i]] = 'missing';
    }

    if (this.state.student.profile) {
      for (let i = 0; i < this.state.student.profile.length; i++) {
        if (this.state.student.profile[i].status === 'uploaded') {
          object_init[this.state.student.profile[i].name] = 'uploaded';
        } else if (this.state.student.profile[i].status === 'accepted') {
          object_init[this.state.student.profile[i].name] = 'accepted';
        } else if (this.state.student.profile[i].status === 'rejected') {
          object_init[this.state.student.profile[i].name] = 'rejected';
        } else if (this.state.student.profile[i].status === 'missing') {
          object_init[this.state.student.profile[i].name] = 'missing';
        } else if (this.state.student.profile[i].status === 'notneeded') {
          object_init[this.state.student.profile[i].name] = 'notneeded';
        }
      }
    } else {
    }

    studentDocOverview = documentlist2_keys.map((key_doc_name, i) => {
      if (object_init[key_doc_name] === 'uploaded') {
        return (
          <tr key={i}>
            <td>
              <AiOutlineFieldTime
                size={24}
                color="orange"
                title="Uploaded successfully"
              />{' '}
            </td>
            <td>{key_doc_name}</td>
          </tr>
        );
      } else if (object_init[key_doc_name] === 'accepted') {
        return (
          <tr key={i + 50}>
            <td>
              <IoCheckmarkCircle
                size={24}
                color="limegreen"
                title="Valid Document"
              />{' '}
            </td>
            <td>{key_doc_name}</td>
          </tr>
        );
      } else if (object_init[key_doc_name] === 'rejected') {
        return (
          <tr key={i + 100}>
            <td>
              <AiFillCloseCircle
                size={24}
                color="red"
                title="Invalid Document"
              />
            </td>
            <td>{key_doc_name}</td>
          </tr>
        );
      } else if (object_init[key_doc_name] === 'notneeded') {
        // return (
        //   // <></>
        //   // <tr key={i}>
        //   //   <td>
        //   //     <BsDash size={24} color="lightgray" title="Not needed" />
        //   //   </td>
        //   //   <td>{key_doc_name}</td>
        //   // </tr>
        // );
      } else {
        return (
          <tr key={i + 200}>
            <td>
              <AiFillQuestionCircle
                size={24}
                color="lightgray"
                title="No Document uploaded"
              />{' '}
            </td>
            <td>{key_doc_name}</td>
          </tr>
        );
      }
    });
    // return <StudentDashboard studentDocOverview={studentDocOverview} />;
    return <>{studentDocOverview}</>;
  }
}

export default StudentMyself;
