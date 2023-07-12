import React, { Component } from 'react';
import { connect } from 'react-redux';
import DEMO from './../../../../store/constant';

import NavLeft from './NavLeft';
import NavRight from './NavRight';
import Aux from '../../../../hoc/_Aux';
import { Link } from 'react-router-dom';
import * as actionTypes from '../../../../store/actions';
import taiger_logo_small from '../../../../assets/images/taiger_logo_small.png';
import NavSearch from './NavLeft/NavSearch';
import {
  is_TaiGer_Student,
  is_TaiGer_role
} from '../../../../Demo/Utils/checking-functions';

class NavBar extends Component {
  render() {
    let headerClass = [
      'navbar',
      'pcoded-header',
      'navbar-expand-lg',
      this.props.headerBackColor
    ];
    if (this.props.headerFixedLayout) {
      headerClass = [...headerClass, 'headerpos-fixed'];
    }

    let toggleClass = ['mobile-menu'];
    if (this.props.collapseMenu) {
      toggleClass = [...toggleClass, 'on'];
    }

    return (
      <Aux>
        <header className={headerClass.join(' ')}>
          <div className="m-header">
            <a
              className={toggleClass.join(' ')}
              id="mobile-collapse1"
              onClick={this.props.onToggleNavigation}
            >
              <span />
            </a>
            <a
              href={DEMO.DASHBOARD_LINK}
              className="b-brand mx-2"
              style={{ textDecoration: 'none' }}
            >
              <img
                className="img-radius"
                src={taiger_logo_small}
                alt="Generic placeholder"
              />
            </a>{' '}
            <Link
              to={`${DEMO.DASHBOARD_LINK}`}
              style={{ textDecoration: 'none' }}
              className="b-brand mx-2"
            >
              <span className="b-title">TaiGer</span>
            </Link>
          </div>
          <a className="mobile-menu" id="mobile-header">
            <i className="feather icon-more-horizontal" />
          </a>
          <div className="collapse navbar-collapse">
            {/* <NavLeft /> */}
            {/* // TODO: when public documents ready, then enable
             */}
            {is_TaiGer_role(this.props.userdata) && (
              <NavSearch user={this.props.userdata} />
            )}
            <NavRight
              rtlLayout={this.props.rtlLayout}
              userdata={this.props.userdata}
              handleOnClickLogout={this.props.handleOnClickLogout}
            />
          </div>
        </header>
      </Aux>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    rtlLayout: state.rtlLayout,
    headerBackColor: state.headerBackColor,
    headerFixedLayout: state.headerFixedLayout,
    collapseMenu: state.collapseMenu
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onToggleNavigation: () => dispatch({ type: actionTypes.COLLAPSE_MENU })
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);
