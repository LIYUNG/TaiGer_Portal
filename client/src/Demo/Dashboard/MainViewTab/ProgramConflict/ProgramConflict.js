import React from 'react';

class ProgramConflict extends React.Component {
  state = {
    students: this.props.students,
    file: ''
  };

  render() {
    var studs_id = this.props.conflict_map[this.props.conf_program_id];
    var stds = studs_id.map((k, i) => (
      <div className='text-info' key={i}>
        {this.props.students.find((stud) => stud._id === studs_id[i]).firstname}
        ,{' '}
        {this.props.students.find((stud) => stud._id === studs_id[i]).lastname}
      </div>
    ));
    var application_deadline = studs_id.map((k, i) => (
      <div className="text-info" key={i}>
        {this.props.students.find((stud) => stud._id === studs_id[i])
          .academic_background.university.expected_application_date
          ? this.props.students.find((stud) => stud._id === studs_id[i])
              .academic_background.university.expected_application_date + '-'
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
            <td className="text-danger">
              {this.props.conflict_programs[this.props.conf_program_id].school}
            </td>
            <td className="text-danger">
              {this.props.conflict_programs[this.props.conf_program_id].program}
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
