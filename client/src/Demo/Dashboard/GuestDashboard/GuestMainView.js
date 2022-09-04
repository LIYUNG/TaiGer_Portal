import React from 'react';
import GuestMyself from './GuestMyself';
import GuestDashboard from './GuestDashboard';
import TimeOutErrors from '../../Utils/TimeOutErrors';
// import Card from '../../../App/components/MainCard';
import { Card } from 'react-bootstrap';

class GuestMainView extends React.Component {
  render() {
    return (
      <>
        <Card className="mt-0">
          <Card.Header as="h5">
            <Card.Title>Welcome to Taiger!</Card.Title>
          </Card.Header>
          <Card.Body>
            I hope you will enjoy the journey in the following months.
          </Card.Body>
        </Card>
      </>
    );
  }
}

export default GuestMainView;
