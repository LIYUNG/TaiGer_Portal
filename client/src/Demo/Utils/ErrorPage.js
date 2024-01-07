import React from 'react';
import { Row, Col } from 'react-bootstrap';
import Card from '../../App/components/MainCard';
import Aux from '../../hoc/_Aux';
import PageNotFoundError from './PageNotFoundError';
import TimeOutErrors from './TimeOutErrors';
import UnauthorizedError from './UnauthorizedError';
import UnauthenticatedError from './UnauthenticatedError';
import TooManyRequestsError from './TooManyRequestsError';
import ResourceLockedError from './ResourceLockedError';
function ErrorPage(props) {
  if (this.props.res_status === 400) {
    return (
      <Aux>
        <Row>
          <Col>
            <Card>Server problem. Please try later.</Card>
          </Col>
        </Row>
      </Aux>
    );
  } else if (this.props.res_status === 401) {
    return <UnauthenticatedError />;
  } else if (this.props.res_status === 403) {
    return <UnauthorizedError />;
  } else if (this.props.res_status === 404) {
    return <PageNotFoundError />;
  } else if (this.props.res_status === 408) {
    return <TimeOutErrors />;
  } else if (this.props.res_status === 423) {
    return <ResourceLockedError />;
  } else if (this.props.res_status === 429) {
    return <TooManyRequestsError />;
  } else if (this.props.res_status >= 500) {
    return (
      <Aux>
        <Row>
          <Col>
            <Card>Server problem. Please try later.</Card>
          </Col>
        </Row>
      </Aux>
    );
  }
}

export default ErrorPage;
