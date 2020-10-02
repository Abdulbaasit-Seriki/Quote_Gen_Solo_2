import React from "react";

import SettingView from "./Setting/Index";

import Navbar from "../../components/NavBar";

const Setting = ({ history }) => {
  return (
    <>
      <Navbar history={history} />
      <SettingView history={history} />
    </>
  );
};

export default Setting;
