import React, { useState, useEffect } from "react";
import {
  TextField,
  Box,
  Button,
  CircularProgress,
  Grid,
} from "@material-ui/core";
import { Card } from "../../components/General";
import { createEmployee } from "../../services/users";
import { makeStyles } from "@material-ui/core/styles";
import DropList from "../../components/DropList";
import { getAllCompanies } from "../../services/company";
import Navbar from "../../components/NavBar";
import { toast } from "react-toastify";
import "../css/NewAccount.css";

import { SETTING } from "../../constants/routes";

import { componentWidth } from "../../constants/style";
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  textField: { width: "100%", backgroundColor: "#FFFFFF" },
}));
const NewAccount = ({ history, ...props }) => {
  const role = localStorage.getItem("role");
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [errorText] = useState({
    emailError: "Invalid email",
    passwordError: "Your password and confirmation password do not match",
  });
  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    company: "",
  });

  useEffect(() => {
    async function fetch() {
      const token = localStorage.getItem("token");
      const { data } = await getAllCompanies(token);
      setCompanies(data.companies);
    }
    if (role === "admin") {
      fetch();
    }
  }, [role]);
  const createNewAccount = async () => {
    const isvalid = isValidate();
    if (!isvalid) {
      toast.warning("Please check your information");
      return;
    }
    const token = localStorage.getItem("token");
    setLoading(true);

    const response = await createEmployee(token, loginInfo);

    if (response) {
      setLoading(false);
      setLoginInfo({
        email: "",
        password: "",
        confirmPassword: "",
        company: "",
      });
      toast.success("User was created successfully", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      history.push(SETTING);
    } else {
      setLoading(false);
    }
  };

  const onChange = (key, value) => {
    setLoginInfo({ ...loginInfo, [key]: value });
  };
  const isValidate = () => {
    const { email, password, confirmPassword, company } = loginInfo;
    const errors = [];
    if (
      email &&
      !email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/) //eslint-disable-line
    ) {
      errors.push("This is not a vaild email");
    }
    if (!password) {
      errors.push("password is required");
    }
    if (role === "admin" && !company) {
      errors.push("company is required");
    }
    if (!email) {
      errors.push("Email is required");
    }
    if (password !== confirmPassword) {
      errors.push("The  password is not matched");
    }
    return !errors.length;
  };
  const checkError = (type) => {
    if (type === "email" && loginInfo.email !== "") {
      // eslint-disable-next-line
      if (loginInfo.email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g)) {
        return false;
      } else {
        return true;
      }
    }
    if (type === "password") {
      if (loginInfo.confirmPassword.length === 0) {
        return false;
      }
      if (loginInfo.password === loginInfo.confirmPassword) {
        return false;
      }
      if (loginInfo.password !== loginInfo.confirmPassword) {
        return true;
      }
    }
  };
  return (
    <>
      <Navbar history={history} />
      <Box m={componentWidth}>
        <Card
          style={{
            width: "100%",
            height: "100%",
            minHeight: "100vh",
          }}
        >
          <h1 style={{ color: "#7EAFDC" }}>Create new employee</h1>
          <br />
          <br />
          <div className={classes.root}>
            <Grid container spacing={3} justify="center">
              <Grid item xs={12} sm={5} lg={10}>
                <Box mb={2}>
                  <TextField
                    required
                    error={checkError("email")}
                    label={checkError("email") ? errorText.emailError : "Email"}
                    variant="filled"
                    value={loginInfo.email}
                    className={classes.textField}
                    onChange={(e) => onChange("email", e.target.value)}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} sm={5}>
                <Box mb={2}>
                  <TextField
                    required
                    type="password"
                    label="Password"
                    variant="filled"
                    value={loginInfo.password}
                    className={classes.textField}
                    onChange={(e) => onChange("password", e.target.value)}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} sm={5}>
                <Box mb={2}>
                  <TextField
                    required
                    type="password"
                    error={checkError("password")}
                    label={
                      checkError("password")
                        ? errorText.passwordError
                        : "Confirm password"
                    }
                    variant="filled"
                    value={loginInfo.confirmPassword}
                    className={classes.textField}
                    onChange={(e) =>
                      onChange("confirmPassword", e.target.value)
                    }
                  />
                </Box>
              </Grid>
              {role === "admin" && (
                <Grid item xs={12} sm={5} lg={10}>
                  <DropList
                    label="Select assossated company"
                    options={companies.map((company) => {
                      return { label: company.name, value: company._id };
                    })}
                    onChange={(value) => onChange("company", value)}
                  />
                </Grid>
              )}

              <Grid item xs={12} sm={5}>
                <Box mb={2}></Box>
              </Grid>

              <Grid item xs={12} sm={5} justify="flex-end" container>
                <Box mb={2}>
                  <Button
                    style={{
                      width: "20%",
                      minWidth: "300px",
                      backgroundColor: "#FFFFFF",
                      color: "#000000",
                    }}
                    variant="contained"
                    size="large"
                    color="primary"
                    onClick={createNewAccount}
                  >
                    {loading ? <CircularProgress /> : "Create New Employee"}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </div>
        </Card>
      </Box>
    </>
  );
};

export default NewAccount;
