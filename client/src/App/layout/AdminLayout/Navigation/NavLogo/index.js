import React from 'react';
import DEMO from './../../../../../store/constant';
import Aux from '../../../../../hoc/_Aux';
import { Link } from 'react-router-dom';

const navLogo = (props) => {
  let toggleClass = ['mobile-menu'];
  if (props.collapseMenu) {
    toggleClass = [...toggleClass, 'on'];
  }

  return (
    <Aux>
      <div className="navbar-brand header-logo">
        <a
          href={DEMO.DASHBOARD_LINK}
          className="b-brand mx-2"
          style={{ textDecoration: 'none' }}
        >
          <img
            className="img-radius"
            src={'/assets/taiger_logo_small.png'}
            alt="Generic placeholder"
          />
        </a>{' '}
        <Link
          to={`${DEMO.DASHBOARD_LINK}`}
          style={{ textDecoration: 'none' }}
          className="b-brand mx-2"
        >
          <span className="b-title"> TaiGer</span>
        </Link>
        <a
          // href={DEMO.BLANK_LINK}
          className={toggleClass.join(' ')}
          id="mobile-collapse"
          onClick={props.onToggleNavigation}
        >
          <span />
        </a>
      </div>
    </Aux>
  );
};

export default navLogo;
