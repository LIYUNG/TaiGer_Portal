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
        itemTitle === 'Academic Survey' ||
        itemTitle === 'My Applications' ||
        itemTitle === 'Tasks Overview'
      ) {
        return false;
      }
      return true;
    }
    if (this.props.role === 'Agent') {
      if (
        itemTitle === 'Academic Survey' ||
        itemTitle === 'Tasks Overview' ||
        itemTitle === 'My Applications' ||
        itemTitle === 'My Tasks Overview' ||
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
        itemTitle === 'Academic Survey' ||
        itemTitle === 'Tasks Overview' ||
        itemTitle === 'My Tasks Overview' ||
        itemTitle === 'My Applications' ||
        itemTitle === 'Program List' ||
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
        itemTitle === 'Program List' ||
        itemTitle === 'Map' ||
        itemTitle === 'Archiv Students' ||
        itemTitle === 'Student Database' ||
        itemTitle === 'User List'
      ) {
        return false;
      }
      return true;
    }
    if (this.props.role === 'Guest') {
      if (
        itemTitle === 'Tasks Overview' ||
        itemTitle === 'Base Documents' ||
        // itemTitle === 'Dashboard' ||
        itemTitle === 'My Tasks Overview' ||
        itemTitle === 'CV/ML/RL Center' ||
        itemTitle === 'Statistics' ||
        itemTitle === 'Charts' ||
        itemTitle === 'Program List' ||
        itemTitle === 'Interview Training' ||
        itemTitle === 'Map' ||
        itemTitle === 'Archiv Students' ||
        itemTitle === 'TaiGer AI' ||
        itemTitle === 'Documentation' ||
        itemTitle === 'Student Database' ||
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
        itemTitle = (
          <span className="pcoded-mtext">{this.props.item.title}</span>
        );
      }

      if (this.props.item.target) {
        itemTarget = '_blank';
      }

      if (this.props.item.external) {
        subContent = (
          <a
            href={this.props.item.url}
            target="_blank"
            rel="noopener noreferrer"
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
            className="nav-link"
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
