import React from 'react';

// const SignUp1 = React.lazy(() =>
//   import('./Demo/Authentication/SignUp/SignUp1')
// );
const SignIn = React.lazy(() => import('./Demo/Authentication/SignIn/SignIn'));
const LandingPage = React.lazy(
    () => import('./Demo/Authentication/LandingPage/index')
);
const ResetPasswordRequest = React.lazy(
    () =>
        import(
            './Demo/Authentication/ResetPasswordRequest/ResetPasswordRequest'
        )
);
const ResetPassword = React.lazy(
    () => import('./Demo/Authentication/ResetPassword/ResetPassword')
);
const AccountActivation = React.lazy(
    () => import('./Demo/Authentication/Activation/Activation')
);

const route = [
    // activate when ready
    // { path: '/sign-up', exact: true, name: 'Signup 1', component: SignUp1 },
    {
        path: '/account/activation',
        exact: true,
        name: 'Signup 1',
        Component: AccountActivation
    },
    {
        path: '/account/reset-password',
        exact: true,
        name: 'ResetPassword',
        Component: ResetPassword
    },
    {
        path: '/account/forgot-password',
        exact: true,
        name: 'ResetPassword 1',
        Component: ResetPasswordRequest
    },
    {
        path: '/account/home',
        exact: true,
        name: 'Home 1',
        Component: LandingPage
    },
    {
        path: '/account/login',
        name: 'Login',
        Component: SignIn
    }
    // { path: '/', exact: false, name: 'Default', Component: SignIn }
];

export default route;
