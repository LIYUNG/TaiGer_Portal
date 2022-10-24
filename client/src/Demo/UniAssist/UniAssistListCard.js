import React from 'react';

class UniAssistListCard extends React.Component {
  render() {
    const app_name = this.props.student.applications.map((application) => (
      <div>
        {application.programId.school} {application.programId.program_name}
        <br />
        {application.programId.uni_assist === 'Yes-FULL' && 'Yes-FULL'}
        {application.programId.uni_assist === 'Yes-VPD' && 'Yes-VPD'}
        {application.programId.uni_assist === 'No' && 'No'}
      </div>
    ));
    return <>{app_name}</>;
  }
}
export default UniAssistListCard;
