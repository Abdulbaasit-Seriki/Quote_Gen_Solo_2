import React from "react";
import { Box, Container } from "@material-ui/core";
import Password from "./Password";
import { componentWidth } from "../../../constants/style";
import UpdateAccount from "./UpdateAccount";
const SettingsView = ({ history }) => {
  return (
    <Container maxWidth="lg">
      <Box m={componentWidth}>
        <h1 style={{ textAlign: "left", width: "50%" }}>Preferences</h1>
        <hr></hr>
        <br />
        <Password />
        <br />
        <UpdateAccount history={history} />
      </Box>
    </Container>
  );
};

export default SettingsView;
