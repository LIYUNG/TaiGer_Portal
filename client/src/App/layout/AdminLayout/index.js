import React, { useState, useEffect } from "react";
import { Suspense } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import Fullscreen from "react-full-screen";
import windowSize from "react-window-size";
import { Spinner } from "react-bootstrap";

import Navigation from "./Navigation";
import NavBar from "./NavBar";
import Breadcrumb from "./Breadcrumb";
import Loader from "../Loader";
import routes from "../../../routes";
import Aux from "../../../hoc/_Aux";
import * as actionTypes from "../../../store/actions";

import routes2 from "../../../route";
import ScrollToTop from "../ScrollToTop";
import { verify } from "../../../api";

import "./app.scss";
import { logout } from "../../../api";

function AdminLayout(props) {
  let [userdata, setUserdata] = useState({
    success: false,
    data: null,
    isloaded: false,
    error: null,
    everlogin: false,
  });

  useEffect(() => {
    console.log("useEffect");
    verify().then((resp) => {
      // console.log(resp.data);
      const { data, success } = resp.data;
      setUserdata((state) => ({
        ...state,
        success: success,
        data: data,
        isloaded: true,
      }));
    });
  }, []);

  const setuserdata2 = (resp) => {
    try {
      if (resp) {
        if (resp.status === 400) {
          alert("This Email is already registered.");
        } else if (resp.status === 401) {
          alert("Password is not correct.");
        } else {
          console.log("successfullllll");
          setUserdata((state) => ({
            ...state,
            success: resp.data.success,
            data: resp.data.data,
            isloaded: true,
          }));
        }
      } else {
        alert("Email or password not correct.");
      }
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    if (
      props.windowWidth >= 992 &&
      props.windowWidth <= 1024 &&
      props.layout !== "horizontal"
    ) {
      props.onComponentWillMount();
    }
  });

  const handleOnClickLogout = (e) => {
    e.preventDefault();
    console.log("click logout");
    logout().then(
      (resp) => {
        console.log(resp.data);
        setUserdata((state) => ({
          ...state,
          data: null,
        }));
        // const { success } = resp.data;
        // this.setState({ success: success });
      },
      (error) => {}
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
        render={() => (
          <route.component
            // {...props}
            user={userdata.data}
          />
        )}
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
          <route.component {...props} userData={setuserdata2} />
        )}
      />
    ) : null;
  });
  const style = {
    position: "fixed",
    top: "40%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  };
  console.log(userdata.data);
  if (!userdata.data && !userdata.everlogin) {
    return (
      <Aux>
        <ScrollToTop>
          <Suspense fallback={<Loader />}>
            <Switch>{menu2}</Switch>
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
            setUserdata={setuserdata2}
            handleOnClickLogout={handleOnClickLogout}
          />
          <div
            className="pcoded-main-container"
            onClick={() => mobileOutClickHandler}
          >
            <div className="pcoded-wrapper">
              <div className="pcoded-content">
                <div className="pcoded-inner-content">
                  <Breadcrumb />
                  <div className="main-body">
                    <div className="page-wrapper">
                      <Suspense fallback={<Loader />}>
                        <Switch>
                          {menu}
                          <Redirect from="/" to={props.defaultPath} />
                        </Switch>
                        {!userdata.isloaded && (
                          <div style={style}>
                            <Spinner animation="border" role="status">
                              <span className="visually-hidden"></span>
                            </Spinner>
                          </div>
                        )}
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
