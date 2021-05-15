import React, { Component, Suspense } from 'react';
import { Route, Switch } from 'react-router-dom';
import Loadable from 'react-loadable';
import './App.css';

import Loader from './layout/Loader'
import Aux from "../hoc/_Aux";
import ScrollToTop from './layout/ScrollToTop';
import routes from "../route";
import Login from './Login';
import useToken from './useToken';

const AdminLayout = Loadable({
  loader: () => import('./layout/AdminLayout'),
  loading: Loader
});
function App() {
  const { token, setToken } = useToken();

  if (!token) {
    return <Login setToken={setToken} />
  }

  const menu = routes.map((route, index) => {
    return (route.component) ? (
        <Route
            key={index}
            path={route.path}
            exact={route.exact}
            name={route.name}
            render={props => (
                <route.component {...props} />
            )} />
    ) : (null);
  });

  return (
    <Aux>
    <ScrollToTop>
        <Suspense fallback={<Loader/>}>
            <Switch>
                {menu}
                <Route path="/" component={AdminLayout} />
            </Switch>
        </Suspense>
    </ScrollToTop>
</Aux>
  );
}

export default App;
