import React from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import { useWindowWidth } from '@react-hook/window-size';

import Aux from '../../../../../../hoc/_Aux';
import NavIcon from './../NavIcon';
import NavBadge from './../NavBadge';
import * as actionTypes from '../../../../../../store/actions';

function NavItem(props) {
  const menuItemFilterByRole = (itemTitle) => {
    if (props.role === 'Admin') {
      if (
        itemTitle === 'My Courses' ||
        itemTitle === 'My Survey' ||
        itemTitle === 'Portals Management' ||
        itemTitle === 'Applications Overview' ||
        itemTitle === 'Uni-Assist Tasks' ||
        itemTitle === 'My Tasks Overview' ||
        itemTitle === 'Charts' ||
        itemTitle === 'Statistics' ||
        itemTitle === 'Map' ||
        itemTitle === 'Tasks Overview' ||
        itemTitle === 'Contact Us'
      ) {
        return false;
      }
      return true;
    }

    if (props.role === 'Agent' || props.role === 'Editor') {
      if (
        itemTitle === 'My Courses' ||
        itemTitle === 'My Survey' ||
        itemTitle === 'Tasks Overview' ||
        itemTitle === 'Portals Management' ||
        itemTitle === 'Applications Overview' ||
        itemTitle === 'Uni-Assist Tasks' ||
        itemTitle === 'My Tasks Overview' ||
        itemTitle === 'Statistics' ||
        itemTitle === 'Charts' ||
        itemTitle === 'Map' ||
        itemTitle === 'User List' ||
        itemTitle === 'User Logs' ||
        itemTitle === 'Contact Us'
      ) {
        return false;
      }
      return true;
    }

    if (props.role === 'Student') {
      if (
        itemTitle === 'Tasks Overview' ||
        itemTitle === 'Charts' ||
        itemTitle === 'Statistics' ||
        itemTitle === 'My Tasks Overview' ||
        itemTitle === 'Program List' ||
        itemTitle === 'Map' ||
        itemTitle === 'Applications Overview' ||
        itemTitle === 'CV/ML/RL Center' ||
        itemTitle === 'Base Documents' ||
        itemTitle === 'Interview Training' ||
        itemTitle === 'TaiGer Admissions' ||
        itemTitle === 'Internal Docs' ||
        itemTitle === 'Archiv Students' ||
        itemTitle === 'Student Database' ||
        itemTitle === 'Tasks Dashboard' ||
        itemTitle === 'TaiGer Members' ||
        itemTitle === 'User Logs' ||
        itemTitle === 'User List'
      ) {
        return false;
      }
      return true;
    }
    if (props.role === 'Guest') {
      if (
        itemTitle === 'Tasks Overview' ||
        itemTitle === 'Uni-Assist Tasks' ||
        itemTitle === 'Base Documents' ||
        itemTitle === 'My Tasks Overview' ||
        itemTitle === 'Applications Overview' ||
        itemTitle === 'CV/ML/RL Center' ||
        itemTitle === 'Statistics' ||
        itemTitle === 'Charts' ||
        itemTitle === 'Program List' ||
        itemTitle === 'Interview Training' ||
        itemTitle === 'TaiGer Admissions' ||
        itemTitle === 'Map' ||
        itemTitle === 'Archiv Students' ||
        itemTitle === 'Internal Docs' ||
        itemTitle === 'Documentation' ||
        itemTitle === 'Student Database' ||
        itemTitle === 'Tasks Dashboard' ||
        itemTitle === 'TaiGer Members' ||
        itemTitle === 'User Logs' ||
        itemTitle === 'User List'
      ) {
        return false;
      }
      return true;
    }
  };
  const onlyWidth = useWindowWidth();
  let itemTitle = props.item.title;
  let itemTarget = '';
  let subContent;
  if (menuItemFilterByRole(itemTitle)) {
    if (props.item.icon) {
      itemTitle = <span className="pcoded-mtext">{props.item.title}</span>;
    }

    if (props.item.target) {
      itemTarget = '_blank';
    }

    if (props.item.external) {
      subContent = (
        <a
          className="nav-link mt-0 py-0"
          href={props.item.url}
          target="_blank"
          rel="noopener"
        >
          <NavIcon items={props.item} />
          {itemTitle}
          <NavBadge layout={props.layout} items={props.item} />
        </a>
      );
    } else {
      subContent = (
        <NavLink
          to={props.item.url}
          className="nav-link mt-0 py-0"
          exact={true}
          target={itemTarget}
        >
          <NavIcon items={props.item} />
          {itemTitle}
          <NavBadge layout={props.layout} items={props.item} />
        </NavLink>
      );
    }
  }
  let mainContent = '';
  if (props.layout === 'horizontal') {
    mainContent = <li onClick={props.onItemLeave}>{subContent}</li>;
  } else {
    if (onlyWidth < 992) {
      mainContent = (
        <li className={props.item.classes} onClick={props.onItemClick}>
          {subContent}
        </li>
      );
    } else {
      mainContent = <li className={props.item.classes}>{subContent}</li>;
    }
  }

  return <Aux>{mainContent}</Aux>;
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
  connect(mapStateToProps, mapDispatchToProps)(NavItem)
);
