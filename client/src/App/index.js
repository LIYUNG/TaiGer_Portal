import React, { Suspense } from "react";
import { BrowserRouter, Switch } from "react-router-dom";
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
          <BrowserRouter>
            <Switch>
              <AdminLayout />
            </Switch>
          </BrowserRouter>
        </Suspense>
      </ScrollToTop>
    </Aux>
  );
}

export default App;
