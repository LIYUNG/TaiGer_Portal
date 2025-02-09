import React, { Suspense } from 'react';
import {
    Navigate,
    Outlet,
    RouterProvider,
    createBrowserRouter,
    useNavigation
} from 'react-router-dom';
import '@fontsource/roboto'; // Defaults to weight 400
import '@fontsource/roboto/400.css'; // Specify weight
import '@fontsource/roboto/400-italic.css'; // Specify weight and style

import NavBar from './components/NavBar';
import routes from './routes';
import routes2 from './route';
import { CssBaseline } from '@mui/material';
import DEMO from './store/constant';
import { useAuth } from './components/AuthProvider';
import Loading from './components/Loading/Loading';

const Layout = () => {
    const navigation = useNavigation();
    return (
        <>
            <CssBaseline />
            <NavBar>
                <main>
                    {navigation.state === 'loading' ? (
                        <Loading />
                    ) : (
                        <Suspense fallback={<Loading />}>
                            <Outlet />
                        </Suspense>
                    )}
                </main>
            </NavBar>
        </>
    );
};

const WrapperPublic = () => {
    const { isAuthenticated } = useAuth();
    const query = new URLSearchParams(window.location.search);

    return isAuthenticated ? (
        query.get('p') ? (
            <Navigate to={query.get('p')} />
        ) : (
            <Navigate to={`${DEMO.DASHBOARD_LINK}`} />
        )
    ) : (
        <Suspense fallback={<Loading />}>
            <Outlet />
        </Suspense>
    );
};

const router = createBrowserRouter([
    {
        path: '/account',
        element: <WrapperPublic />,
        children: [...routes2]
    },
    {
        path: '/',
        element: <Layout />,
        children: [...routes]
    },
    {
        path: '*',
        element: <Navigate replace to={DEMO.LOGIN_LINK} />
    }
]);

const App = () => {
    return <RouterProvider router={router} />;
};

export default App;
