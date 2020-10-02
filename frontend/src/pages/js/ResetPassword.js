import React, { useState } from "react";
import Navbar from "../../components/NavBar";
import { resetPassword } from "../../services/auth";
import CardTitle from "../../components/CardTitle";
import { TextField, Box, Button } from "@material-ui/core";
import { LOGIN, SIGNUP } from "../../constants/routes";
import { toast } from "react-toastify";

const ResetPassword = ({ location, history, ...props }) => {
  const [email, setEmail] = useState("");

  const handleResetPassword = async () => {
    let response = await resetPassword(email);
    if (response !== undefined) {
      toast.success("Please check your email ", {
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
      <Navbar history={history} />
      <CardTitle
        width="40%"
        style={{ maxWidth: "550px" }}
        body={
          <>
            <h1>Lost your password?</h1>
            <p style={{ width: "90%", textAlign: "center", fontSize: "15px" }}>
              It happens to the best of us! Enter your email address to recive
              instruction on how to reset your password.
            </p>
            <Box mt={2} mb={2} style={{ width: "90%", minWidth: "250px" }}>
              <label style={{ fontWeight: "bold", marginBottom: "20px" }}>
                Email address
              </label>
              <TextField
                style={{ width: "100%", marginTop: "10px" }}
                required
                id="outlined-required"
                type="text"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="text-input"
                placeholder="Email"
              />
            </Box>
            <Box mt={2} mb={2} style={{ width: "90%", minWidth: "250px" }}>
              <Button
                style={{
                  width: "100%",
                  minWidth: "250px",
                  color: "#FFFFFF",
                  fontSize: "15px",
                  fontWeight: "bold",
                  backgroundColor: "#1C7AEE",
                }}
                variant="contained"
                size="large"
                color="primary"
                onClick={handleResetPassword}
              >
                Submit
              </Button>
            </Box>
            <br />
            <span>
              Need an account?{" "}
              <span
                style={{
                  color: "gray",
                  textDecoration: "underline",
                  cursor: "pointer",
                }}
                onClick={() => history.push(SIGNUP)}
              >
                Sign up
              </span>
            </span>
            <br />
            <span>
              Suddenly remembered?{" "}
              <span
                style={{
                  color: "gray",
                  textDecoration: "underline",
                  cursor: "pointer",
                }}
                onClick={() => history.push(LOGIN)}
              >
                Sign in
              </span>
            </span>
          </>
        }
      />
    </>
  );
};

export default ResetPassword;
