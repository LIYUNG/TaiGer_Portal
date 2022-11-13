import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';

import Aux from '../../hoc/_Aux/index';

class LoadingPage extends React.Component {
  componentDidMount() {}
  render() {
    return (
      <Aux>
        <Row></Row>
      </Aux>
    );
  }
}

export default LoadingPage;
