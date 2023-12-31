import React from 'react';
import { Link } from 'react-router-dom';
import DEMO from '../../../../store/constant';

class ProgramConflict extends React.Component {
  state = {
    students: this.props.students,
    file: ''
  };

  render() {
    var studs_id = this.props.conflict_map[this.props.conf_program_id];
    var stds = studs_id.map((k, i) => (
      <div className="text-info" key={i}>
        <Link
          to={`${DEMO.STUDENT_DATABASE_STUDENTID_LINK(
            studs_id[i],
            DEMO.PROFILE
          )}`}
          style={{ textDecoration: 'none' }}
          className="text-info"
        >
          {
            this.props.students.find((stud) => stud._id === studs_id[i])
              .firstname
          }
          ,{' '}
          {
            this.props.students.find((stud) => stud._id === studs_id[i])
              .lastname
          }
        </Link>
      </div>
    ));
    var application_deadline = studs_id.map((k, i) => (
      <div className="text-info" key={i}>
        {this.props.students.find((stud) => stud._id === studs_id[i]) &&
        this.props.students.find((stud) => stud._id === studs_id[i])
          .application_preference &&
        this.props.students.find((stud) => stud._id === studs_id[i])
          .application_preference.expected_application_date
          ? this.props.students.find((stud) => stud._id === studs_id[i])
              .application_preference.expected_application_date + '-'
          : ''}
        {
          this.props.conflict_programs[this.props.conf_program_id]
            .application_deadline
        }
      </div>
    ));
    return (
      <>
        <tbody>
          <tr>
            <td>
              <Link
                to={`${DEMO.SINGLE_PROGRAM_LINK(this.props.conf_program_id)}`}
                style={{ textDecoration: 'none' }}
                className="text-danger"
              >
                <b>
                  {
                    this.props.conflict_programs[this.props.conf_program_id]
                      .school
                  }
                </b>
              </Link>
              <br></br>
              <Link
                to={`${DEMO.SINGLE_PROGRAM_LINK(this.props.conf_program_id)}`}
                style={{ textDecoration: 'none' }}
                className="text-danger"
              >
                {
                  this.props.conflict_programs[this.props.conf_program_id]
                    .program
                }
              </Link>
            </td>
            <td>{stds}</td>
            <td>{application_deadline}</td>
          </tr>
        </tbody>
      </>
    );
  }
}

export default ProgramConflict;
