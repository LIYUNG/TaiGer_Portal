import React, { useState, useEffect } from 'react';
import { Spinner } from 'react-bootstrap';

import './../../assets/scss/style.scss';
import Aux from '../../hoc/_Aux';
import taiger_logo from '../../assets/images/taiger_logo.png';

export default function Loading() {
  return (
    <Aux>
      <div className="auth-wrapper">
        <Spinner
          style={{
            position: 'fixed',
            top: '45%',
            left: '50%'
          }}
          variant={'light'}
        ></Spinner>
      </div>
    </Aux>
  );
}
