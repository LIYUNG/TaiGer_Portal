import React, { Component, Suspense } from 'react';
import { Switch, Route } from 'react-router-dom';
import Loadable from 'react-loadable';

// import '../../node_modules/font-awesome/scss/font-awesome.scss';

import Loader from './layout/Loader'
import Aux from "../hoc/_Aux";
import ScrollToTop from './layout/ScrollToTop';
// import routes from "../route";

import Login from './components/Login';
import useToken from './components/useToken';
import Signin1 from '../Demo/Authentication/SignIn/SignIn1';


const AdminLayout = Loadable({
    loader: () => import('./layout/AdminLayout'),
    loading: Loader
});


function App() {
    // render() {

    // const { token, setToken } = useToken();
    // // console.log('token value ' + token)

    // const menu = routes.map((route, index) => {
    //     return (route.component) ? (
    //         <Route
    //             key={index}
    //             path={route.path}
    //             exact={route.exact}
    //             name={route.name}
    //             render={props => (
    //                 <route.component {...props} />
    //             )} />
    //     ) : (null);
    // });

    // if (!token) {

    //     // return <Login setToken={setToken} />
    //     return (
    //         <Aux>
    //             <ScrollToTop>
    //                 <Suspense fallback={<Loader />}>
    //                     <Switch>
    //                         {menu}
    //                         {/* <Route
    //                             path="/" component={AdminLayout} /> */}
    //                     </Switch>
    //                     <Signin1 setToken={setToken} />
    //                 </Suspense>
    //             </ScrollToTop>
    //         </Aux>
    //     );
    // }

    return (
        <Aux>
            <ScrollToTop>
                <Suspense fallback={<Loader />}>
                    <Switch>
                        {/* {menu} */}
                        <Route
                            path="/" component={AdminLayout} />
                    </Switch>
                </Suspense>
            </ScrollToTop>
        </Aux>
    );
    // }
}

export default App;
