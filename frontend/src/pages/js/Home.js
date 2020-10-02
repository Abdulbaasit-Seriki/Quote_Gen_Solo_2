import React from "react";
import { Redirect } from "react-router-dom";
import * as routers from "../../constants/routes";
function Home(props) {
  return <Redirect to={routers.LOGIN} />;
}

export default Home;
