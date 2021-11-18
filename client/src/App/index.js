import React, { useState, Suspense } from "react";
import { Switch, Route } from "react-router-dom";
import Loadable from "react-loadable";
import Loader from "./layout/Loader";
import Aux from "../hoc/_Aux";
import ScrollToTop from "./layout/ScrollToTop";
import AdminLayout from "./layout/AdminLayout";

// const AdminLayout = Loadable({
//   //   loader: () => import("./layout/AdminLayout"),
//   //   loading: Loader,
//   loader: () => import("./layout/AdminLayout"),
//   loading: Loader,
// });

// class App extends React.Component {
//     render() {
//         return (
//             <Aux>
//                 <ScrollToTop>
//                     <Suspense fallback={<Loader />}>
//                         <Switch>
//                             <Route
//                                 path="/" component={AdminLayout} />
//                         </Switch>
//                     </Suspense>
//                 </ScrollToTop>
//             </Aux >
//         );
//     }
// }

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
