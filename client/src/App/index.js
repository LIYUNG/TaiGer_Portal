import React, { Suspense } from 'react';
import { Switch, Route } from 'react-router-dom';
import Loadable from 'react-loadable';
import Loader from './layout/Loader'
import Aux from "../hoc/_Aux";
import ScrollToTop from './layout/ScrollToTop';



const AdminLayout = Loadable({
    loader: () => import('./layout/AdminLayout'),
    loading: Loader
});


function App() {
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
