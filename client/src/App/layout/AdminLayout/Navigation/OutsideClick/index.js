import React, { useState, useRef, useEffect } from 'react';
import { connect } from 'react-redux';
// import windowSize from 'react-window-size';
import {
  useWindowSize,
  useWindowWidth,
  useWindowHeight
} from '@react-hook/window-size';

import * as actionTypes from '../../../../../store/actions';

function OutsideClick(props) {
  // const constructor(props) {
  //   super(props);

  //   this.setWrapperRef = this.setWrapperRef.bind(this);
  //   this.handleOutsideClick = this.handleOutsideClick.bind(this);
  // }
  const onlyWidth = useWindowWidth();
  const target = useRef(null);

  const [wrapperRef, setWrapperRef] = useState(null);
  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);
    // returned function will be called on component unmount
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  });

  /**
   * close menu if clicked on outside of element
   */
  const handleOutsideClick = (event) => {
    if (wrapperRef && !wrapperRef.contains(event.target)) {
      if (onlyWidth && props.collapseMenu) {
        props.onToggleNavigation();
      }
    }
  };

  return (
    <div className="nav-outside" ref={setWrapperRef}>
      {props.children}
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    collapseMenu: state.collapseMenu
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onToggleNavigation: () => dispatch({ type: actionTypes.COLLAPSE_MENU })
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(OutsideClick);
