import React from "react";
import * as Yup from "yup";
import { Formik } from "formik";
import {
  Box,
  Button,
  TextField,
  Typography,
} from "@material-ui/core";
import NavBar from "../../../components/NavBar";
import { toast } from "react-toastify";
import { createCompany } from "../../../services/company";

const Company = ({ history, match }) => {
  const signUp = async (values) => {
    const response = await createCompany({...values, admin:true}).catch((error) => {
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
      toast.success("Company created", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  return (
    <>
      <NavBar history={history} />
      <div style={{ width: "80%", margin: "auto" }}>
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
                  Create new compnay
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
                  Create
                </Button>
              </Box>
            </form>
          )}
        </Formik>
      </div>
    </>
  );
};

export default Company;
