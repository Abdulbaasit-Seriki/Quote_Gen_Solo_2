import React from "react";
import Navbar from "../../components/NavBar";
import { Box, Button, TextField, CircularProgress } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import DropList from "../../components/DropList";
import { signup } from "../../services/auth";
import { Card, Error } from "../../components/General";
import {
  EmailType,
  PasswordType,
  FirstNameType,
  LastNameType,
  RoleType,
} from "./InputTypes";
import { componentWidth } from "../../constants/style";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "3%",
  },
  paper: {
    padding: theme.spacing(1),
    textAlign: "center",
  },
  button: {
    marginTop: "3%",
    width: "50%",
    minWidth: "300px",
  },
  droplist: {
    width: "100%",
  },
}));

const Account = ({ history }) => {
  const [hasError, sethasError] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const classes = useStyles();
  const [userInfo, setUserInfo] = React.useState({
    email: "",
    password: "",
    role: "",
    firstName: "",
    lastName: "",
  });
  const createAccount = async () => {
    setLoading(true);
    const response = await signup(userInfo).catch((error) => {
      setLoading(false);
      return sethasError(true);
    });
    if (response) {
      setLoading(false);
    }
  };
  return (
    <>
      <Navbar history={history} />
      <Box m={componentWidth}>
        <h1>Sign up</h1>
        {/* Grid */}
        <div className={classes.root}>
          {/* <Grid container spacing={3}>
            <Grid item xs={4}>
              <div className={classes.paper}> */}
          <Box mt={2} mb={2} style={{ minWidth: "300px", width: "50%" }}>
            <TextField
              style={{ width: "100%" }}
              required
              variant="outlined"
              label={FirstNameType}
              value={userInfo.firstName}
              onChange={(e) =>
                setUserInfo({ ...userInfo, firstName: e.target.value })
              }
              placeholder={FirstNameType}
            />
          </Box>
          {/* </div>
            </Grid>
            <Grid item xs={4}>
              <div className={classes.paper}> */}
          <Box mt={2} mb={2} style={{ minWidth: "300px", width: "50%" }}>
            <TextField
              style={{ width: "100%" }}
              required
              label={LastNameType}
              variant="outlined"
              value={userInfo.lastName}
              onChange={(e) =>
                setUserInfo({ ...userInfo, lastName: e.target.value })
              }
              placeholder={LastNameType}
            />
          </Box>
          {/* </div>
            </Grid>
            <Grid item xs={6}>
              <div className={classes.paper}> */}
          <Box mt={2} mb={2} style={{ minWidth: "300px", width: "50%" }}>
            <TextField
              style={{ width: "100%" }}
              required
              id="outlined-required"
              label={EmailType}
              variant="outlined"
              value={userInfo.email}
              onChange={(e) =>
                setUserInfo({ ...userInfo, email: e.target.value })
              }
              placeholder={EmailType}
            />
          </Box>
          {/* </div>
            </Grid>
            <Grid item xs={6}>
              <div className={classes.paper}> */}
          <Box mt={2} mb={2} style={{ minWidth: "300px", width: "50%" }}>
            <TextField
              style={{ width: "100%" }}
              label={PasswordType}
              type={PasswordType}
              autoComplete="current-password"
              variant="outlined"
              value={userInfo.password}
              onChange={(e) =>
                setUserInfo({ ...userInfo, password: e.target.value })
              }
              required
              placeholder={PasswordType}
            />
          </Box>
          {/* </div>
            </Grid>
          </Grid> */}
          <Box mt={2} mb={2} style={{ minWidth: "300px", width: "50%" }}>
            <DropList
              className={classes.droplist}
              options={[
                { label: "Admin", value: "Admin" },
                { label: "Company", value: "Company" },
              ]}
              label={RoleType}
              onChange={(value) => setUserInfo({ ...userInfo, role: value })}
            />
          </Box>
        </div>

        <Button
          disabled={
            loading ||
            !userInfo.password ||
            !userInfo.email ||
            !userInfo.firstName ||
            !userInfo.lastName ||
            !userInfo.role
          }
          className={classes.button}
          variant="contained"
          size="large"
          color="primary"
          onClick={createAccount}
        >
          {loading ? <CircularProgress /> : "Create the account"}
        </Button>
        {hasError && (
          <Box mt={2}>
            <Error>somethis is wrong</Error>
          </Box>
        )}
      </Box>
    </>
  );
};

export default Account;
