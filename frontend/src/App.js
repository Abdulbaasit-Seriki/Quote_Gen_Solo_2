import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import AdminRoute from "./AdminRoute";
import Home from "./pages/js/Home";
import Company from "./pages/js/Company";
import Login from "./pages/js/Login";
import Validate from "./pages/js/Validate";
import SignUp from "./pages/js/SignUp";
import Complete from "./pages/js/Complete";
import ResetPassword from "./pages/js/ResetPassword";
import ChangePassword from "./pages/js/ChangePassword";
import Setting from "./pages/js/Setting";
import { ToastContainer } from "react-toastify";
import FAQ from "./pages/js/FAQ";

import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import Account from "./pages/js/Account";
import CurrentAccount from "./pages/js/CurrentAccount";
import NotFound from "./pages/js/404";
import { SessionProvider } from "./context/auth";

import Admin from "./pages/js/Admin/Admin";
import Companies from "./pages/js/Admin/Companies";
import Accounts from "./pages/js/Admin/Accounts";
import CreateCompany from "./pages/js/Admin/Create-Company";
import Logs from "./pages/js/Admin/Logs";
import NewAccount from "./pages/js/newAccount";

import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import * as Routers from "./constants/routes";
import * as adminRoutes from "./constants/adminRoutes";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faEnvelope,
  faCheckCircle,
  faTimesCircle,
  faUser,
  faKey,
  faTrash,
  faSignOutAlt,
  faUserCircle,
  faCogs,
  faBuilding,
  faExclamationCircle,
} from "@fortawesome/free-solid-svg-icons";
import "./App.css";
import "typeface-roboto";
import "react-toastify/dist/ReactToastify.css";

library.add(faUser, faKey);
library.add(faEnvelope, faKey);
library.add(faCheckCircle, faKey);
library.add(faTimesCircle, faKey);
library.add(faTrash, faKey);
library.add(faUserCircle, faKey);
library.add(faSignOutAlt, faKey);
library.add(faCogs, faKey);
library.add(faBuilding, faKey);
library.add(faExclamationCircle, faKey);

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#7EAFDC",
    },
  },
});
function App({ history }) {
  useEffect(() => {
    const interval = setInterval(() => {
      const expire = localStorage.getItem("expire");
      const isAuth = localStorage.getItem("isAuth");
      const token = localStorage.getItem("token");
      if (isAuth && token && expire && new Date().getTime() / 1000 > expire) {
        clearInterval(interval);
        localStorage.removeItem("isAuth");
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("expire");
        window.location.reload();
      }
    }, 10000);
    return () => clearInterval(interval);
  }, [history]);
  return (
    <SessionProvider>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover
      />
      <MuiThemeProvider theme={theme}>
        <Router>
          <Switch>
            <Route
              exact
              path={Routers.HOME}
              component={Home}
              history={history}
            />
            <Route
              exact
              path={Routers.SETTING}
              component={Setting}
              history={history}
            />
            <Route
              exact
              path={Routers.RESET_PASSWORD}
              component={ResetPassword}
              history={history}
            />
            <Route
              exact
              path={Routers.CHANGE_PASSWORD}
              component={ChangePassword}
              history={history}
            />

            <PrivateRoute exact path={Routers.COMPANY} component={Company} />

            <AdminRoute exact path={adminRoutes.ADMIN} component={Admin} />
            <AdminRoute
              exact
              path={adminRoutes.ACCOUNTS}
              component={Accounts}
            />
            <AdminRoute exact path={adminRoutes.LOGS} component={Logs} />
            {/* <AdminRoute exact path={adminRoutes.LOGS} component={Logs} /> */}
            <AdminRoute
              exact
              path={adminRoutes.COMPANIES}
              component={Companies}
            />
            <AdminRoute
              path={adminRoutes.CREATE_COMPANY}
              component={CreateCompany}
            />
            <Route path={Routers.ACCOUNT} component={NewAccount} />

            <PrivateRoute exact path={Routers.ACCOUNT} component={Account} />
            <Route
              exact
              path={Routers.SHOW_ACCOUNT}
              component={CurrentAccount}
            />

            {/* FAQ route define here */}
            <Route exact path={Routers.FAQ} component={FAQ} />

            <Route exact path={Routers.LOGIN} component={Login} />
            <PrivateRoute path={Routers.VALIDATE} component={Validate} />
            <Route exact path={Routers.SIGNUP} component={SignUp} />
            <PrivateRoute exact path={Routers.COMPLETE} component={Complete} />
            <Route component={NotFound} />
          </Switch>
        </Router>
      </MuiThemeProvider>
    </SessionProvider>
  );
}

export default App;
