import React, { Component, Suspense, useState } from "react";
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
  const getToken = () => {
    const tokenString = localStorage.getItem("token");
    // console.log('tokenString  ' + tokenString)
    try {
      const userToken = JSON.parse(tokenString);
      // console.log('userToken  ' + userToken)
      return userToken;
    } catch (e) {
      const userToken = JSON.parse("0");
      // console.log('userToken  ' + userToken)
      return userToken;
    }
  };

  const fullScreenExitHandler = () => {
    if (
      !document.fullscreenElement &&
      !document.webkitIsFullScreen &&
      !document.mozFullScreen &&
      !document.msFullscreenElement
    ) {
      this.props.onFullScreenExit();
    }
  };

  // // componentWillMount() {
  // UNSAFE_componentWillMount() {
  //   if (
  //     this.props.windowWidth > 992 &&
  //     this.props.windowWidth <= 1024 &&
  //     this.props.layout !== "horizontal"
  //   ) {
  //     this.props.onComponentWillMount();
  //   }
  // }

  const mobileOutClickHandler = () => {
    if (this.props.windowWidth < 992 && this.props.collapseMenu) {
      this.props.onComponentWillMount();
    }
  };

  const handleSetToken = (token, role) => {
    try {
      this.setState({
        token: token,
        role: role,
      });
    } catch (e) {
      console.log(e);
    }
  };

  // const handleRemoveToken = () => {
  //   try {
  //     this.setState({
  //       token: null,
  //       role: null,
  //     });
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };

  // const saveToken = (data) => {
  //   try {
  //     if (data) {
  //       localStorage.setItem("token", JSON.stringify(data.token));
  //       handleSetToken(data.token, data.role);
  //     } else {
  //       alert("Email or password not correct.");
  //     }
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };

  const [cookies, setCookie, removeCookie] = useCookies(["x-auth"]);
  let [authenticated, setAuthenticated] = useState(
    cookies.token !== undefined
  );
  /* full screen exit call */
  document.addEventListener("fullscreenchange", fullScreenExitHandler);
  document.addEventListener(
    "webkitfullscreenchange",
    fullScreenExitHandler
  );
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
          <route.component {...props}  />
        )}
      />
    ) : null;
  });

  // if (!this.state.token) {
  if (!authenticated) {
    return (
      <Aux>
        <ScrollToTop>
          <Suspense fallback={<Loader />}>
            <Switch>
              {menu2}
            </Switch>
          </Suspense>
        </ScrollToTop>
      </Aux>
    );
  }
  return (
      <Aux>
        <Fullscreen enabled={this.props.isFullScreen}>
          <Navigation role={this.state.role} />
          <NavBar handleRemoveToken={this.handleRemoveToken} />
          <div
            className="pcoded-main-container"
            onClick={() => this.mobileOutClickHandler}
          >
            <div className="pcoded-wrapper">
              <div className="pcoded-content">
                <div className="pcoded-inner-content">
                  <Breadcrumb role={this.state.role} />
                  <div className="main-body">
                    <div className="page-wrapper">
                      <Suspense fallback={<Loader />}>
                        <Switch>
                          {menu}
                          <Redirect from="/" to={this.props.defaultPath} />
                        </Switch>
                      </Suspense>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Fullscreen>
      </Aux>);
}

// class AdminLayout_old extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       token: null,
//       role: "",
//     };

//     this.getToken = this.getToken.bind(this);
//     this.handleSetToken = this.handleSetToken.bind(this);
//     this.saveToken = this.saveToken.bind(this);
//     this.handleRemoveToken = this.handleRemoveToken.bind(this);
//   }
//   componentDidMount() {
//     this.setState({
//       token: localStorage.getItem("token"),
//     });
//   }
//   getToken() {
//     const tokenString = localStorage.getItem("token");
//     // console.log('tokenString  ' + tokenString)
//     try {
//       const userToken = JSON.parse(tokenString);
//       // console.log('userToken  ' + userToken)
//       return userToken;
//     } catch (e) {
//       const userToken = JSON.parse("0");
//       // console.log('userToken  ' + userToken)
//       return userToken;
//     }
//   }

//   fullScreenExitHandler = () => {
//     if (
//       !document.fullscreenElement &&
//       !document.webkitIsFullScreen &&
//       !document.mozFullScreen &&
//       !document.msFullscreenElement
//     ) {
//       this.props.onFullScreenExit();
//     }
//   };

//   // componentWillMount() {
//   UNSAFE_componentWillMount() {
//     if (
//       this.props.windowWidth > 992 &&
//       this.props.windowWidth <= 1024 &&
//       this.props.layout !== "horizontal"
//     ) {
//       this.props.onComponentWillMount();
//     }
//   }

//   mobileOutClickHandler() {
//     if (this.props.windowWidth < 992 && this.props.collapseMenu) {
//       this.props.onComponentWillMount();
//     }
//   }

//   handleSetToken = (token, role) => {
//     try {
//       this.setState({
//         token: token,
//         role: role,
//       });
//     } catch (e) {
//       console.log(e);
//     }
//   };

//   handleRemoveToken = () => {
//     try {
//       this.setState({
//         token: null,
//         role: null,
//       });
//     } catch (e) {
//       console.log(e);
//     }
//   };

//   saveToken = (data) => {
//     try {
//       if (data) {
//         localStorage.setItem("token", JSON.stringify(data.token));
//         this.handleSetToken(data.token, data.role);
//       } else {
//         alert("Email or password not correct.");
//       }
//     } catch (e) {
//       console.log(e);
//     }
//   };

//   render() {
//     /* full screen exit call */
//     document.addEventListener("fullscreenchange", this.fullScreenExitHandler);
//     document.addEventListener(
//       "webkitfullscreenchange",
//       this.fullScreenExitHandler
//     );
//     document.addEventListener(
//       "mozfullscreenchange",
//       this.fullScreenExitHandler
//     );
//     document.addEventListener("MSFullscreenChange", this.fullScreenExitHandler);

//     const menu = routes.map((route, index) => {
//       return route.component ? (
//         <Route
//           key={index}
//           path={route.path}
//           exact={route.exact}
//           name={route.name}
//           render={(props) => <route.component {...props} />}
//         />
//       ) : null;
//     });

//     const menu2 = routes2.map((route, index) => {
//       return route.component ? (
//         <Route
//           key={index}
//           path={route.path}
//           exact={route.exact}
//           name={route.name}
//           render={(props) => (
//             <route.component {...props} setToken={this.saveToken} />
//           )}
//         />
//       ) : null;
//     });

//     if (!this.state.token) {
//       return (
//         <Aux>
//           <ScrollToTop>
//             <Suspense fallback={<Loader />}>
//               <Switch>
//                 {menu2}
//                 {/* <Route
//                                     path="/" component={AdminLayout} /> */}
//               </Switch>
//             </Suspense>
//           </ScrollToTop>
//         </Aux>
//       );
//     }

//     return (
//       <Aux>
//         <Fullscreen enabled={this.props.isFullScreen}>
//           <Navigation role={this.state.role} />
//           <NavBar handleRemoveToken={this.handleRemoveToken} />
//           <div
//             className="pcoded-main-container"
//             onClick={() => this.mobileOutClickHandler}
//           >
//             <div className="pcoded-wrapper">
//               <div className="pcoded-content">
//                 <div className="pcoded-inner-content">
//                   <Breadcrumb role={this.state.role} />
//                   <div className="main-body">
//                     <div className="page-wrapper">
//                       <Suspense fallback={<Loader />}>
//                         <Switch>
//                           {menu}
//                           <Redirect from="/" to={this.props.defaultPath} />
//                         </Switch>
//                       </Suspense>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </Fullscreen>
//       </Aux>
//     );
//   }
// }

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
