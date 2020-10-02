import React, { useEffect, useState } from "react";
import { Route, Redirect } from "react-router-dom";
import { useSessionDispatch } from "./context/auth";
import { getUserByToken } from "./services/auth";
import { handleUserNextStep } from "./Utilities/auth";
import * as routers from "./constants/routes";
function PrivateRoute({ component: Component, path, ...rest }) {
  const dispatchSessionState = useSessionDispatch();
  const isAuth = localStorage.getItem("isAuth");
  const [route, setRoute] = useState("");
  useEffect(() => {
    const token = localStorage.getItem("token");
    async function check() {
      const { data } = await getUserByToken(token);
      handleAfterAuth(data);
      const route = handleUserNextStep(data.user);
      setRoute(route);
    }
    if (isAuth && token) {
      check();
    }else{
      setRoute(routers.LOGIN);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAfterAuth = (data) => {
    dispatchSessionState({
      type: "addActiveUser",
      ...data,
    });
    localStorage.setItem("isAuth", true);
    localStorage.setItem("token", data.token);
    localStorage.setItem("role", data.user.role);
  };
  return (
    route && (
      <Route
        {...rest}
        render={(props) => {
          if (isAuth) {
            if (path.replace(/\\/g, "") === route) {
              return <Component {...props} />;
            }
            return (
              <Redirect
                to={{ pathname: route, state: { referer: props.location } }}
              />
            );
          }
          return (
            <Redirect
              to={{
                pathname: routers.LOGIN,
                state: { referer: props.location },
              }}
            />
          );
        }}
      />
    )
  );
}

export default PrivateRoute;
