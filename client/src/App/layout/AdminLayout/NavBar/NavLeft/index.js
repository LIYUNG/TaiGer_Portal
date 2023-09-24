import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Dropdown } from 'react-bootstrap';
// import windowSize from 'react-window-size';
import { useWindowWidth } from '@react-hook/window-size';

import NavSearch from './NavSearch';
import Aux from '../../../../../hoc/_Aux';
import DEMO from '../../../../../store/constant';
import * as actionTypes from '../../../../../store/actions';

function NavLeft(props) {
  const onlyWidth = useWindowWidth();
  let navItemClass = ['nav-item'];
  if (onlyWidth <= 575) {
    navItemClass = [...navItemClass, 'd-none'];
  }
  let dropdownRightAlign = false;
  if (props.rtlLayout) {
    dropdownRightAlign = true;
  }

  return (
    <Aux>
      <ul className="navbar-nav mr-auto">
        <li className={navItemClass.join(' ')}>
          <Dropdown alignRight={dropdownRightAlign}>
            <Dropdown.Toggle variant={'link'} id="dropdown-basic">
              Dropdown
            </Dropdown.Toggle>
            <ul>
              <Dropdown.Menu>
                <li>
                  <a className="dropdown-item" href={DEMO.BLANK_LINK}>
                    Action
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href={DEMO.BLANK_LINK}>
                    Another action
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href={DEMO.BLANK_LINK}>
                    Something else here
                  </a>
                </li>
              </Dropdown.Menu>
            </ul>
          </Dropdown>
        </li>
        <li className="nav-item">
          <NavSearch />
        </li>
      </ul>
    </Aux>
  );
}

const mapStateToProps = (state) => {
  return {
    isFullScreen: state.isFullScreen,
    rtlLayout: state.rtlLayout
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onFullScreen: () => dispatch({ type: actionTypes.FULL_SCREEN })
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NavLeft);
