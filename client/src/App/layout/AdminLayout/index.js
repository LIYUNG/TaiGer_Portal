import React, { Component, Suspense, useState, useEffect } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import Fullscreen from "react-full-screen";
import windowSize from "react-window-size";

import Navigation from "./Navigation";
import NavBar from "./NavBar";
import Breadcrumb from "./Breadcrumb";
import Loader from "../Loader";
import routes from "../../../routes";
import Aux from "../../../hoc/_Aux";
import * as actionTypes from "../../../store/actions";

import routes2 from "../../../route";
import ScrollToTop from "../ScrollToTop";
import { useCookies } from "react-cookie";
import "./app.scss";

function AdminLayout(props) {
  let [userdata, setUserdata] = useState({ success: false, data: null });

  const setuserdata = (resp) => {
    try {
      if (resp) {
        console.log(resp.data.success);
        console.log(resp.data.data);

        setUserdata({
          success: resp.data.success,
          data: resp.data.data,
        });
      } else {
        alert("Email or password not correct.");
      }
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
      if (
        props.windowWidth > 992 &&
        props.windowWidth <= 1024 &&
        props.layout !== "horizontal"
      ) {
        props.onComponentWillMount();
      }
  });
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
  document.addEventListener("fullscreenchange", fullScreenExitHandler);
  document.addEventListener("webkitfullscreenchange", fullScreenExitHandler);
  document.addEventListener("mozfullscreenchange", fullScreenExitHandler);
  document.addEventListener("MSFullscreenChange", fullScreenExitHandler);

  const menu = routes.map((route, index) => {
    return route.component ? (
      <Route
        key={index}
        path={route.path}
        exact={route.exact}
        name={route.name}
        render={(props) => <route.component {...props} />}
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
          // <route.component {...props} setToken={saveToken} />
          <route.component {...props} userData={setuserdata} />
        )}
      />
    ) : null;
  });

  if (!userdata.success) {
    return (
      <Aux>
        <ScrollToTop>
          <Suspense fallback={<Loader />}>
            <Switch>{menu2}</Switch>
          </Suspense>
        </ScrollToTop>
      </Aux>
    );
  }
  return (
    <Aux>
      <Fullscreen enabled={props.isFullScreen}>
        <Navigation role={userdata.data.role} />
        <NavBar />
        <div
          className="pcoded-main-container"
          onClick={() => mobileOutClickHandler}
        >
          <div className="pcoded-wrapper">
            <div className="pcoded-content">
              <div className="pcoded-inner-content">
                <Breadcrumb role={userdata.data.role} />
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


const mapStateToProps = (state) => {
  return {
    defaultPath: state.defaultPath,
    isFullScreen: state.isFullScreen,
    collapseMenu: state.collapseMenu,
    configBlock: state.configBlock,
    layout: state.layout,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onFullScreenExit: () => dispatch({ type: actionTypes.FULL_SCREEN_EXIT }),
    onComponentWillMount: () => dispatch({ type: actionTypes.COLLAPSE_MENU }),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(windowSize(AdminLayout));
