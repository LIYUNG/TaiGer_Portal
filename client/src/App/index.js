import React, { useState, Suspense } from "react";
import { Switch, Route } from "react-router-dom";
import Loadable from "react-loadable";
import Loader from "./layout/Loader";
import Aux from "../hoc/_Aux";
import ScrollToTop from "./layout/ScrollToTop";
import AdminLayout from "./layout/AdminLayout";

function App() {
  let [userdata, setUserdata] = useState({ success: false, data: null });
  return (
    <Aux>
      <ScrollToTop>
        <Suspense fallback={<Loader />}>
          <Switch>
            <AdminLayout
              userdata={userdata}
              setUserdata={setUserdata}
            />
          </Switch>
        </Suspense>
      </ScrollToTop>
    </Aux>
  );
}

export default App;
