import React from 'react';
import Aux from '../../../hoc/_Aux/index';
import { Row, Col, Card } from 'react-bootstrap';
import { Chart } from 'react-google-charts';
import {
  getStudents,
  updateArchivStudents,
  updateProfileDocumentStatus,
  getAgents,
  updateAgents,
  getEditors,
  updateEditors
} from '../../../api';
export const data = [
  [
    {
      v: 'Mike',
      f: 'Mike<div style="color:red; font-style:italic">President</div>'
    },
    '',
    'The President'
  ],
  [
    {
      v: 'Jim',
      f: 'Jim<div style="color:red; font-style:italic">Vice President</div>'
    },
    'Mike',
    'VP'
  ],
  ['Alice', 'Mike', ''],
  ['Bob', 'Jim', 'Bob Sponge'],
  ['Carol', 'Bob', '']
];

export const options = {
  allowHtml: true
};

class OrgChart extends React.Component {
  state = {
    error: null,
    timeouterror: null,
    unauthorizederror: null,
    modalShow: false,
    agent_list: [],
    editor_list: [],
    isLoaded: false,
    students: [],
    updateAgentList: {},
    updateEditorList: {},
    success: false,
    isDashboard: true,
    file: ''
  };
  componentDidMount() {
    // getStudents().then(
    //   (resp) => {
    //     const { data, success } = resp.data;
    //     if (success) {
    //       this.setState({
    //         isLoaded: true,
    //         students: data,
    //         success: success
    //       });
    //     } else {
    //       if (resp.status === 401 || resp.status === 500) {
    //         this.setState({ isLoaded: true, timeouterror: true });
    //       } else if (resp.status === 403) {
    //         this.setState({ isLoaded: true, unauthorizederror: true });
    //       }
    //     }
    //   },
    //   (error) => {
    //     this.setState({
    //       isLoaded: true,
    //       error: true
    //     });
    //   }
    // );
  }
  render() {
    return (
      <Aux>
        <Row>
          <Chart
            chartType="OrgChart"
            data={data}
            options={options}
            width="100%"
            height="400px"
          />
        </Row>
      </Aux>
    );
  }
}

export default OrgChart;
