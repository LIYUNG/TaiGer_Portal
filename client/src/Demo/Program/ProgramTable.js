import React from 'react';
import { Row, Col } from 'react-bootstrap';
import Card from '../../App/components/MainCard';
import Aux from '../../hoc/_Aux';
import ProgramList from './ProgramList';
import { Redirect } from 'react-router-dom';

class ProgramTable extends React.Component {
  render() {
    if (
      this.props.user.role !== 'Admin' &&
      this.props.user.role !== 'Editor' &&
      this.props.user.role !== 'Agent'
    ) {
      return <Redirect to="/dashboard/default" />;
    }
    return (
      <Aux>
        <Row>
          <Col>
            <ProgramList
              role={this.props.user.role}
              userId={this.props.user._id}
            />
          </Col>
        </Row>
      </Aux>
    );
  }
}

export default ProgramTable;
