import React from 'react';

const SignUp1 = React.lazy(() =>
  import('./Demo/Authentication/SignUp/SignUp1')
);
const Signin1 = React.lazy(() =>
  import('./Demo/Authentication/SignIn/SignIn1')
);
const ResetPasswordRequest = React.lazy(() =>
  import('./Demo/Authentication/ResetPasswordRequest/ResetPasswordRequest')
);
const ResetPassword = React.lazy(() =>
  import('./Demo/Authentication/ResetPassword/ResetPassword')
);
const AccountActivation = React.lazy(() =>
  import('./Demo/Authentication/Activation/Activation')
);

const route = [
  // activate when ready
  // { path: '/sign-up', exact: true, name: 'Signup 1', component: SignUp1 },
  {
    path: '/account/activation',
    exact: true,
    name: 'Signup 1',
    component: AccountActivation
  },
  {
    path: '/account/reset-password',
    exact: true,
    name: 'ResetPassword',
    component: ResetPassword
  },
  {
    path: '/forgot-password',
    exact: true,
    name: 'ResetPassword 1',
    component: ResetPasswordRequest
  },
  {
    path: '/login',
    exact: true,
    name: 'Login',
    component: Signin1
  },
  { path: '/', exact: false, name: 'Default', component: Signin1 }
];

export default route;
