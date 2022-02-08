import React from "react";

class ProgramConflict extends React.Component {
  state = {
    students: this.props.students,
    file: "",
  };

  render() {

    let studs_id = this.props.conflict_map[this.props.conf_program_id];
    let stds = studs_id.map((k, i) => (
      <h6 key={i}>
        {this.props.students.find((stud) => stud._id === studs_id[i]).firstname}
        ,{" "}
        {this.props.students.find((stud) => stud._id === studs_id[i]).lastname}
      </h6>
    ));

    return (
      <>
        <tbody>
          <tr>
            <td>
              <h6>
                {
                  this.props.conflict_programs[this.props.conf_program_id]
                    .school
                }
              </h6>
            </td>
            <td>
              <h6>
                {
                  this.props.conflict_programs[this.props.conf_program_id]
                    .program
                }
              </h6>
            </td>
            <td>{stds}</td>
            <td>
              <h6>
                {
                  this.props.conflict_programs[this.props.conf_program_id]
                    .application_deadline
                }
              </h6>
            </td>
          </tr>
        </tbody>
      </>
    );
  }
}

export default ProgramConflict;
