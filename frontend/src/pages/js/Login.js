import React, { useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import * as Yup from "yup";
import { Formik } from "formik";
import {
  Box,
  Button,
  Container,
  Grid,
  Link,
  TextField,
  Typography,
  makeStyles,
} from "@material-ui/core";
import Page from "../../components/Page";
import { handleUserNextStep } from "../../Utilities/auth";
import { login, loginGmail } from "../../services/auth";
import { SIGNUP, RESET_PASSWORD } from "../../constants/routes";
import Navbar from "../../components/NavBar";
import { getUserByToken } from "../../services/auth";
import { setCookie } from "../../services/cookies";
// import loginStyle from "../css/Login.css";

import { toast } from "react-toastify";
import { GoogleLogin } from "react-google-login";
const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    height: "100%",
    paddingBottom: theme.spacing(3),
  },
}));

const LoginView = ({ history }) => {
  const classes = useStyles();
  const toatStyles = {
    position: "bottom-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const isAuth = localStorage.getItem("isAuth");
    async function check() {
      try {
        const { data } = await getUserByToken(token);
        const route = handleUserNextStep(data.user);
        history.push(route);
      } catch (err) {}
    }
    if (isAuth && token) {
      check();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const handleGmail = async (res) => {
    const { email, name, googleId: password, imageUrl: logo } = res.profileObj;
    const response = await loginGmail({
      email,
      orgName: name,
      logo,
      phone: "",
      name,
      password,
    });
    if (response) {
      const { data } = response;
      setCookie(data);
      const route = handleUserNextStep(data.user);
      toast.success("Login Successful.", toatStyles);
      return history.push(route);
    }
  };

  const postLogin = async (values) => {
    const response = await login(values);
    if (response) {
      const { data } = response;
      setCookie(data);
      const route = handleUserNextStep(data.user);
      toast.success("Login Successful.", toatStyles);
      return history.push(route);
    }
  };
  return (
    <Page className={classes.root} title="Login">
      <Navbar history={history} />
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        marginTop="50px"
      >
        <Container maxWidth="sm" className="container">
          <Formik
            initialValues={{
              email: "",
              password: "",
            }}
            validationSchema={Yup.object().shape({
              email: Yup.string()
                .email("Must be a valid email")
                .max(255)
                .required("Email is required"),
              password: Yup.string().max(255).required("Password is required"),
            })}
            onSubmit={postLogin}
          >
            {({
              errors,
              handleBlur,
              handleChange,
              handleSubmit,
              isSubmitting,
              touched,
              values,
            }) => (
              <form onSubmit={handleSubmit}>
                <Box mb={3}>
                  <Typography color="textPrimary" variant="h5">
                    Sign in
                  </Typography>
                  <Typography
                    color="textSecondary"
                    gutterBottom
                    variant="body2"
                  >
                    Sign in with different platform
                  </Typography>
                </Box>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={12} id="google-login">
                    <GoogleLogin
                      clientId={process.env.REACT_APP_CLIENT_ID}
                      buttonText="Login with Google"
                      onSuccess={handleGmail}
                      onFailure={(error) => error}
                      cookiePolicy={"single_host_origin"}
                      className="googleLogin"
                    />
                  </Grid>
                </Grid>
                <Box mt={3} mb={1}>
                  <Typography
                    align="center"
                    color="textSecondary"
                    variant="body1"
                  >
                    or login with email address
                  </Typography>
                </Box>
                <TextField
                  error={Boolean(touched.email && errors.email)}
                  fullWidth
                  helperText={touched.email && errors.email}
                  label="Email Address"
                  margin="normal"
                  name="email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="email"
                  value={values.email}
                  variant="outlined"
                />
                <TextField
                  error={Boolean(touched.password && errors.password)}
                  fullWidth
                  helperText={touched.password && errors.password}
                  label="Password"
                  margin="normal"
                  name="password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="password"
                  value={values.password}
                  variant="outlined"
                />
                <Box my={2}>
                  <Button
                    color="primary"
                    disabled={isSubmitting}
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                    className="button"
                  >
                    Sign in now
                  </Button>
                </Box>
                <Typography
                  color="textSecondary"
                  variant="body1"
                  style={{ textAlign: "center" }}
                >
                  Don&apos;t have an account?
                  <Link
                    component={RouterLink}
                    to={SIGNUP}
                    variant="h6"
                    style={{ fontSize: "15px" }}
                  >
                    {" "}
                    Sign up
                  </Link>
                  <br />
                  <Link
                    component={RouterLink}
                    to={RESET_PASSWORD}
                    variant="h6"
                    style={{ fontSize: "15px" }}
                  >
                    Forgot my password
                  </Link>
                </Typography>
              </form>
            )}
          </Formik>
        </Container>
      </Box>
    </Page>
  );
};

export default LoginView;
