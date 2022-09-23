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
        <a href={DEMO.BLANK_LINK} className="b-brand">
            <div>TODO:Put Logo</div>
          {/* <div className="b-bg">
            <i className="feather icon-trending-up" />
          </div> */}
          <Link to={'/dashboard/default'}>
            <span className="b-title">TaiGer2</span>
          </Link>
        </a>
        <a
          href={DEMO.BLANK_LINK}
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
