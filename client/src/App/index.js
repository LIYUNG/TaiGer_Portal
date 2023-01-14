import React, { Suspense } from 'react';
import { Switch } from 'react-router-dom';
// import Loadable from "react-loadable";
import Loader from './layout/Loader';
import Aux from '../hoc/_Aux';
import ScrollToTop from './layout/ScrollToTop';
import AdminLayout from './layout/AdminLayout';

function App() {
  return (
    <Aux>
      <AdminLayout />
    </Aux>
  );
}

export default App;
