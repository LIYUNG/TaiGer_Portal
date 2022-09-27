import React from 'react';
import DEMO from './../../../../../store/constant';
import Aux from '../../../../../hoc/_Aux';
import { Link } from 'react-router-dom';
import taiger_logo_small from '../../../../../assets/images/taiger_logo_small.png';

const navLogo = (props) => {
  let toggleClass = ['mobile-menu'];
  if (props.collapseMenu) {
    toggleClass = [...toggleClass, 'on'];
  }

  return (
    <Aux>
      <div className="navbar-brand header-logo">
        <a
          href={DEMO.BLANK_LINK}
          className="b-brand"
          style={{ textDecoration: 'none' }}
        >
          {/* <div>TODO:Put Logo</div>
          <div className="b-bg">
            <i className="feather icon-trending-up" />
          </div> */}
          <img
            className="img-radius"
            src={taiger_logo_small}
            alt="Generic placeholder"
          />
          <Link to={'/dashboard/defualt'} style={{ textDecoration: 'none' }}>
            <span className="b-title">TaiGer</span>
          </Link>
        </a>
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
