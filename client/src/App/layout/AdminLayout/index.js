import React, { useState, useEffect, Suspense } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import Fullscreen from 'react-full-screen';
import windowSize from 'react-window-size';

import Navigation from './Navigation';
import NavBar from './NavBar';
import Breadcrumb from './Breadcrumb';
import Loader from '../Loader';
import routes from '../../../routes';
import Aux from '../../../hoc/_Aux';
import * as actionTypes from '../../../store/actions';
import routes2 from '../../../route';
import routes3 from '../../../route3';
import ScrollToTop from '../ScrollToTop';
import { verify, logout } from '../../../api/index';

function AdminLayout(props) {
  let [userdata, setUserdata] = useState({
    error: '',
    success: false,
    data: null,
    isLoaded: false,
    res_modal_message: '',
    res_modal_status: 0
  });

  useEffect(() => {
    verify().then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        if (success) {
          // TODO: to be remove in production
          setTimeout(function () {
            setUserdata((state) => ({
              ...state,
              success: success,
              data: data,
              isLoaded: true
            }));
          }, 1000);
        } else {
          setTimeout(function () {
            setUserdata((state) => ({
              ...state,
              data: null,
              isLoaded: true
            }));
          }, 1000);
        }
      },
      (error) => {
        const { statusText } = resp;
        setUserdata((state) => ({
          ...state,
          isLoaded: true,
          error,
          res_modal_status: 500,
          res_modal_message: statusText
        }));
      }
    );
  }, [userdata.isLoaded]);

  useEffect(() => {
    if (
      props.windowWidth >= 992 &&
      props.windowWidth <= 1024 &&
      props.layout !== 'horizontal'
    ) {
      props.onComponentWillMount();
    }
  }, [props.layout]);

  const handleOnClickLogout = (e) => {
    e.preventDefault();
    logout().then(
      (resp) => {
        setUserdata((state) => ({
          ...state,
          data: null
        }));
      },
      (error) => {
        const { statusText } = resp;
        setUserdata((state) => ({
          ...state,
          isLoaded: true,
          error,
          res_modal_status: 500,
          res_modal_message: statusText
        }));
      }
    );
  };

  const fullScreenExitHandler = () => {
    if (
      !document.fullscreenElement &&
      !document.webkitIsFullScreen &&
      !document.mozFullScreen &&
      !document.msFullscreenElement
    ) {
      props.onFullScreenExit();
    }
  };

  const mobileOutClickHandler = () => {
    if (props.windowWidth < 992 && props.collapseMenu) {
      props.onComponentWillMount();
    }
  };

  /* full screen exit call */
  document.addEventListener('fullscreenchange', fullScreenExitHandler);
  document.addEventListener('webkitfullscreenchange', fullScreenExitHandler);
  document.addEventListener('mozfullscreenchange', fullScreenExitHandler);
  document.addEventListener('MSFullscreenChange', fullScreenExitHandler);

  const menu = routes.map((route, index) => {
    return route.component ? (
      <Route
        key={index}
        path={route.path}
        exact={route.exact}
        name={route.name}
        render={(props) => <route.component {...props} user={userdata.data} />}
      />
    ) : null;
  });

  const menu2 = routes2.map((route, index) => {
    return route.component ? (
      <Route
        key={index}
        path={route.path}
        exact={route.exact}
        name={route.name}
        render={(props) => (
          <route.component {...props} setUserdata={setUserdata} />
        )}
      />
    ) : null;
  });

  const menu3 = routes3.map((route, index) => {
    return route.component ? (
      <Route
        key={index}
        path={route.path}
        exact={route.exact}
        name={route.name}
        render={(props) => (
          <route.component {...props} setUserdata={setUserdata} />
        )}
      />
    ) : null;
  });

  if (!userdata.isLoaded) {
    return (
      <Aux>
        <ScrollToTop>
          <Suspense fallback={<Loader />}>
            <Switch>{menu3}</Switch>
          </Suspense>
        </ScrollToTop>
      </Aux>
    );
  }
  if (!userdata.data) {
    return (
      <Aux>
        <ScrollToTop>
          <Suspense fallback={<Loader />}>
            <Switch>
              {menu2}
              <Redirect from="/" to="/" />
            </Switch>
          </Suspense>
        </ScrollToTop>
      </Aux>
    );
  } else {
    return (
      <Aux>
        <Fullscreen enabled={props.isFullScreen}>
          <Navigation userdata={userdata.data} />
          <NavBar
            userdata={userdata.data}
            handleOnClickLogout={handleOnClickLogout}
          />
          <div
            className="pcoded-main-container"
            onClick={() => mobileOutClickHandler}
          >
            <div className="pcoded-wrapper">
              <div className="pcoded-content">
                <div className="pcoded-inner-content">
                  {/* <Breadcrumb /> */}
                  <div className="main-body">
                    <div className="page-wrapper">
                      <Suspense fallback={<Loader />}>
                        <Switch>
                          {menu}
                          <Redirect from="/" to={props.defaultPath} />
                        </Switch>
                      </Suspense>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Fullscreen>
      </Aux>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    defaultPath: state.defaultPath,
    isFullScreen: state.isFullScreen,
    collapseMenu: state.collapseMenu,
    configBlock: state.configBlock,
    layout: state.layout
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onFullScreenExit: () => dispatch({ type: actionTypes.FULL_SCREEN_EXIT }),
    onComponentWillMount: () => dispatch({ type: actionTypes.COLLAPSE_MENU })
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(windowSize(AdminLayout));
