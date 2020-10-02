import React from "react";
import { Link as RouterLink } from "react-router-dom";
import * as Yup from "yup";
import { Formik } from "formik";
import {
  Box,
  Button,
  Container,
  Link,
  TextField,
  Typography,
  makeStyles,
} from "@material-ui/core";
import Page from "../../components/Page";
import Navbar from "../../components/NavBar";
import { handleUserNextStep } from "../../Utilities/auth";
import { loginGmail } from "../../services/auth";
import { GoogleLogin } from "react-google-login";
import { toast } from "react-toastify";
import { createCompany } from "../../services/company";
import { setCookie } from "../../services/cookies";

// import LOGO from "../img/logo2.png";
const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    height: "100%",
    paddingBottom: theme.spacing(3),
  },
}));

const RegisterView = ({ history }) => {
  const classes = useStyles();

  const signUp = async (values) => {
    const response = await createCompany(values).catch((error) => {
      toast.error(error.response.data.message, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    });
    if (response) {
      const { data } = response;
      setCookie(data);
      const route = handleUserNextStep(data.user);
      toast.success("Register Successful", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return history.push({
        pathname: route,
        state: { email: values.email },
      });
    }
  };

  const handleGmail = async (res) => {
    const { email, name, googleId: password, imageUrl: logo } = res.profileObj;
    const response = await loginGmail({
      email,
      orgName: name,
      logo,
      phone: "",
      name,
      password,
    }).catch((error) => {
      toast.error("This email is used before ", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    });
    if (response) {
      const { data } = response;
      setCookie(data);
      const route = handleUserNextStep(data.user);
      return history.push(route);
    }
  };
  return (
    <Page className={classes.root} title="Register">
      <Navbar history={history} />
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        marginTop="50px"
      >
        <Container maxWidth="sm">
          {/* <img
            src={LOGO}
            width="20%"
            alt="logo"
            style={{ minWidth: "150px" }}
          /> */}
          <Formik
            initialValues={{
              email: "",
              name: "",
              orgName: "",
              password: "",
              confirmPassword: "",
              phone: "",
            }}
            validationSchema={Yup.object().shape({
              email: Yup.string()
                .email("Must be a valid email")
                .max(255)
                .required("Email is required"),
              name: Yup.string().max(255).required("Name is required"),
              orgName: Yup.string()
                .max(255)
                .required("Organization name is required"),
              phone: Yup.string()
                .matches(/^[1-9]\d{9}$/, {
                  message: "Please enter valid Phone number.",
                  excludeEmptyString: false,
                })
                .required("Phone Number is required"),
              password: Yup.string().max(255).required("password is required"),
              confirmPassword: Yup.string().when("password", {
                is: (val) => (val && val.length > 0 ? true : false),
                then: Yup.string().oneOf(
                  [Yup.ref("password")],
                  "Both password need to be the same"
                ),
              }),
            })}
            onSubmit={signUp}
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
                    Create new account
                  </Typography>
                  <Typography
                    color="textSecondary"
                    gutterBottom
                    variant="body2"
                  >
                    Sign up using your primary sales admin email account
                  </Typography>
                </Box>
                <TextField
                  error={Boolean(touched.name && errors.name)}
                  fullWidth
                  helperText={touched.name && errors.name}
                  label="Name"
                  margin="normal"
                  name="name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.name}
                  variant="outlined"
                />
                <TextField
                  error={Boolean(touched.orgName && errors.orgName)}
                  fullWidth
                  helperText={touched.orgName && errors.orgName}
                  label="Company Name"
                  margin="normal"
                  name="orgName"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.orgName}
                  variant="outlined"
                />
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
                  error={Boolean(touched.phone && errors.phone)}
                  fullWidth
                  helperText={touched.phone && errors.phone}
                  label="Phone"
                  margin="normal"
                  name="phone"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="phone"
                  value={values.phone}
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
                <TextField
                  error={Boolean(
                    touched.confirmPassword && errors.confirmPassword
                  )}
                  fullWidth
                  helperText={touched.confirmPassword && errors.confirmPassword}
                  label="Confirm Password"
                  margin="normal"
                  name="confirmPassword"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="password"
                  value={values.confirmPassword}
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
                    style={{
                      color: "#FFFFFF",
                    }}
                  >
                    Sign up now
                  </Button>
                </Box>

                <Box my={2} style={{ width: "100%" }} id="google-login">
                  <GoogleLogin
                    clientId={process.env.REACT_APP_CLIENT_ID}
                    buttonText="Sign up with google"
                    onSuccess={handleGmail}
                    onFailure={(error) => error}
                    cookiePolicy={"single_host_origin"}
                  />
                </Box>
                <Typography color="textSecondary" variant="body1">
                  Have an account?{" "}
                  <Link
                    component={RouterLink}
                    to="/login"
                    variant="h6"
                    style={{ fontSize: "15px" }}
                  >
                    Sign in
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

export default RegisterView;
