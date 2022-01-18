import React, { useState, Suspense } from "react";
import { Switch } from "react-router-dom";
// import Loadable from "react-loadable";
import Loader from "./layout/Loader";
import Aux from "../hoc/_Aux";
import ScrollToTop from "./layout/ScrollToTop";
import AdminLayout from "./layout/AdminLayout";

function App() {
  return (
    <Aux>
      <ScrollToTop>
        <Suspense fallback={<Loader />}>
          <Switch>
            <AdminLayout />
          </Switch>
        </Suspense>
      </ScrollToTop>
    </Aux>
  );
}

export default App;
