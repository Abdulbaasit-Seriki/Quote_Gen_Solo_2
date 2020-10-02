import React, { useState } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  TextField,
  makeStyles,
} from "@material-ui/core";
import { toast } from "react-toastify";
import { updatePassword, checkPassword } from "../../../services/auth";
import { alertConfig } from "../../../constants/style";

const useStyles = makeStyles({
  root: {},
});

const Password = ({ className, ...rest }) => {
  const classes = useStyles();
  const [values, setValues] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const resetForm = () => {
    setValues({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };
  const handleCheckPassword = async () => {
    const token = localStorage.getItem("token");
    const { data } = await checkPassword(values.currentPassword, token);
    if (data.success) {
      return true;
    }
    resetForm();
    toast.error("Current Password is wrong Password", alertConfig);
    return false;
  };
  const handleChangePassword = async () => {
    const token = localStorage.getItem("token");
    if (await handleCheckPassword) {
      const { data } = await updatePassword(values.newPassword, token);
      if (data.success) {
        toast.success("Password Update Successful", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
        });
        resetForm();
      } else {
        toast.error("Fail to Update Password", alertConfig);
      }
    }
  };

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };

  return (
    <form className={clsx(classes.root, className)} {...rest}>
      <Card>
        <CardHeader subheader="Update password" title="Password" />
        <Divider />
        <CardContent>
          <TextField
            fullWidth
            label="Current Password"
            margin="normal"
            name="currentPassword"
            onChange={handleChange}
            type="password"
            value={values.currentPassword}
            variant="outlined"
          />
          <TextField
            fullWidth
            label="New Password"
            margin="normal"
            name="newPassword"
            onChange={handleChange}
            type="password"
            value={values.newPassword}
            variant="outlined"
          />
          <TextField
            fullWidth
            label="Confirm password"
            margin="normal"
            name="confirmPassword"
            onChange={handleChange}
            type="password"
            value={values.confirmPassword}
            variant="outlined"
          />
        </CardContent>
        <Divider />
        <Box display="flex" justifyContent="flex-end" p={2}>
          <Button
            color="primary"
            variant="contained"
            disabled={
              !values.currentPassword ||
              values.newPassword !== values.confirmPassword
            }
            onClick={handleChangePassword}
          >
            Update
          </Button>
        </Box>
      </Card>
    </form>
  );
};

Password.propTypes = {
  className: PropTypes.string,
};

export default Password;
