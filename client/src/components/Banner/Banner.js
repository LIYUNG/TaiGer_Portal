import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Card } from 'react-bootstrap';
import { BsExclamationTriangle, BsX } from 'react-icons/bs';

export default function Banner(props) {
  return (
    <Row>
      <Col>
        <Card className="my-1 mx-0" bg={'danger'} text={'light'}>
          <p className="text-light my-3 mx-3" style={{ textAlign: 'left' }}>
            <BsExclamationTriangle size={18} />
            <b className="mx-2">Reminder:</b> {props.text}:{' '}
            <Link
              to={`${props.path}`}
              style={{ textDecoration: 'none' }}
              className="text-info"
            >
              {props.link_name}
            </Link>{' '}
            <span style={{ float: 'right', cursor: 'pointer' }}>
              {!props.ReadOnlyMode && (
                <BsX
                  size={18}
                  onClick={(e) => props.removeBanner(e, props.notification_key)}
                />
              )}
            </span>
          </p>
        </Card>
      </Col>
    </Row>
  );
}
