import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import windowSize from 'react-window-size';

import Aux from '../../../../../../hoc/_Aux';
import NavIcon from './../NavIcon';
import NavBadge from './../NavBadge';
import * as actionTypes from '../../../../../../store/actions';

class NavItem extends Component {
  menuItemFilterByRole = (itemTitle) => {
    if (this.props.role === 'Admin') {
      if (
        itemTitle === 'My Courses' ||
        itemTitle === 'Academic Survey' ||
        itemTitle === 'Uni-Assist Tasks' ||
        itemTitle === 'My Tasks Overview' ||
        itemTitle === 'Check List' ||
        itemTitle === 'Charts' ||
        itemTitle === 'Interview Training' ||
        itemTitle === 'Statistics' ||
        itemTitle === 'TaiGer AI' ||
        itemTitle === 'Map' ||
        itemTitle === 'Tasks Overview'
      ) {
        return false;
      }
      return true;
    }
    if (this.props.role === 'Agent') {
      if (
        itemTitle === 'My Courses' ||
        itemTitle === 'Academic Survey' ||
        itemTitle === 'Tasks Overview' ||
        itemTitle === 'Uni-Assist Tasks' ||
        itemTitle === 'Check List' ||
        itemTitle === 'My Tasks Overview' ||
        itemTitle === 'Interview Training' ||
        itemTitle === 'Statistics' ||
        itemTitle === 'TaiGer AI' ||
        itemTitle === 'Charts' ||
        itemTitle === 'Map' ||
        itemTitle === 'User List'
      ) {
        return false;
      }
      return true;
    }
    if (this.props.role === 'Editor') {
      if (
        itemTitle === 'My Courses' ||
        itemTitle === 'Academic Survey' ||
        itemTitle === 'Tasks Overview' ||
        itemTitle === 'Check List' ||
        itemTitle === 'Uni-Assist Tasks' ||
        itemTitle === 'My Tasks Overview' ||
        itemTitle === 'Interview Training' ||
        itemTitle === 'Program List' ||
        itemTitle === 'Statistics' ||
        itemTitle === 'TaiGer AI' ||
        itemTitle === 'Charts' ||
        itemTitle === 'Map' ||
        itemTitle === 'User List'
      ) {
        return false;
      }
      return true;
    }
    if (this.props.role === 'Student') {
      if (
        itemTitle === 'Tasks Overview' ||
        itemTitle === 'Charts' ||
        itemTitle === 'Statistics' ||
        itemTitle === 'Check List' ||
        itemTitle === 'My Tasks Overview' ||
        itemTitle === 'Program List' ||
        itemTitle === 'Interview Training' ||
        itemTitle === 'Map' ||
        itemTitle === 'TaiGer Admissions' ||
        itemTitle === 'TaiGer AI' ||
        itemTitle === 'Internal Docs' ||
        itemTitle === 'Archiv Students' ||
        itemTitle === 'Student Database' ||
        itemTitle === 'TaiGer Teams' ||
        itemTitle === 'User List'
      ) {
        return false;
      }
      return true;
    }
    if (this.props.role === 'Guest') {
      if (
        itemTitle === 'Tasks Overview' ||
        itemTitle === 'Uni-Assist Tasks' ||
        itemTitle === 'Base Documents' ||
        itemTitle === 'My Tasks Overview' ||
        itemTitle === 'Applications Overview' ||
        itemTitle === 'Check List' ||
        itemTitle === 'CV/ML/RL Center' ||
        itemTitle === 'Statistics' ||
        itemTitle === 'Charts' ||
        itemTitle === 'Program List' ||
        itemTitle === 'Interview Training' ||
        itemTitle === 'TaiGer Admissions' ||
        itemTitle === 'Map' ||
        itemTitle === 'Archiv Students' ||
        itemTitle === 'TaiGer AI' ||
        itemTitle === 'Internal Docs' ||
        itemTitle === 'Documentation' ||
        itemTitle === 'Student Database' ||
        itemTitle === 'TaiGer Teams' ||
        itemTitle === 'User List'
      ) {
        return false;
      }
      return true;
    }
  };
  render() {
    let itemTitle = this.props.item.title;
    let itemTarget = '';
    let subContent;
    if (this.menuItemFilterByRole(itemTitle)) {
      if (this.props.item.icon) {
        itemTitle = <span className="mt-0 py-0">{this.props.item.title}</span>;
      }

      if (this.props.item.target) {
        itemTarget = '_blank';
      }

      if (this.props.item.external) {
        subContent = (
          <a
            className="nav-link mt-0 py-0"
            href={this.props.item.url}
            target="_blank"
            rel="noopener"
          >
            <NavIcon items={this.props.item} />
            {itemTitle}
            <NavBadge layout={this.props.layout} items={this.props.item} />
          </a>
        );
      } else {
        subContent = (
          <NavLink
            to={this.props.item.url}
            className="nav-link mt-0 py-0"
            exact={true}
            target={itemTarget}
          >
            <NavIcon items={this.props.item} />
            {itemTitle}
            <NavBadge layout={this.props.layout} items={this.props.item} />
          </NavLink>
        );
      }
    }
    let mainContent = '';
    if (this.props.layout === 'horizontal') {
      mainContent = <li onClick={this.props.onItemLeave}>{subContent}</li>;
    } else {
      if (this.props.windowWidth < 992) {
        mainContent = (
          <li
            className={this.props.item.classes}
            onClick={this.props.onItemClick}
          >
            {subContent}
          </li>
        );
      } else {
        mainContent = <li className={this.props.item.classes}>{subContent}</li>;
      }
    }

    return <Aux>{mainContent}</Aux>;
  }
}

const mapStateToProps = (state) => {
  return {
    layout: state.layout,
    collapseMenu: state.collapseMenu
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onItemClick: () => dispatch({ type: actionTypes.COLLAPSE_MENU }),
    onItemLeave: () => dispatch({ type: actionTypes.NAV_CONTENT_LEAVE })
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(windowSize(NavItem))
);
