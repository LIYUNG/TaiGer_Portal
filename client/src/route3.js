import React from 'react';

const Loading = React.lazy(() => import('./components/Loading/Loading'));

const route = [
  { path: '/', exact: false, name: 'Default', component: Loading }
];

export default route;
