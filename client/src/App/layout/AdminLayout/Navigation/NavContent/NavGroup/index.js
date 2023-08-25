import React from 'react';
import Aux from '../../../../../../hoc/_Aux';
import NavCollapse from './../NavCollapse';
import NavItem from './../NavItem';

const navGroup = (props) => {
  let navItems = '';
  if (props.group.children) {
    const groups = props.group.children;
    navItems = Object.keys(groups).map((item, i) => {
      item = groups[item];
      switch (item.type) {
        case 'collapse':
          return (
            <NavCollapse
              user={props.user}
              key={item.id}
              collapse={item}
              type="main"
            />
          );
        case 'item':
          // if (props.user.role === 'Student') {
          //   if (item.title === 'My Applications') {
          //     item.url = `/my-applications/${props.user._id.toString()}`;
          //   }
          // }
          return (
            <NavItem
              role={props.user.role}
              layout={props.layout}
              key={item.id}
              item={item}
            />
          );
        default:
          return <></>;
      }
    });
  }

  return (
    <Aux>
      <li key={props.group.id} className="nav-item pcoded-menu-caption">
        <label>{props.group.title}</label>
      </li>
      {navItems}
    </Aux>
  );
};

export default navGroup;
