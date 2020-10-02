import React, { useEffect, useState } from "react";
import { Route, Redirect } from "react-router-dom";
import { getUserByToken } from "./services/auth";
import { LOGIN } from "./constants/routes";
function PrivateRoute({ component: Component, path, ...rest }) {
  const isAuth = localStorage.getItem("isAuth");
  const role = localStorage.getItem("role");
  const [ , setIsAdmin] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem("token");
    async function check() {
      const { data } = await getUserByToken(token);
      handleAfterAuth(data);
      setIsAdmin(data.user.role === "admin");
      setDone(true);
    }
    if (isAuth && token) {
      check();
    } else {
      setDone(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAfterAuth = (data) => {
    localStorage.setItem("isAuth", true);
    localStorage.setItem("token", data.token);
    localStorage.setItem("role", data.user.role);
  };
  return (
    done && (
      <Route
        {...rest}
        render={(props) => {
          if (isAuth && (role==="company" || role === "admin")) {
            return <Component {...props} />;
          }
          return (
            <Redirect
              to={{
                pathname: LOGIN,
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
