import React, { useEffect, useState } from "react";
import Navbar from "../../components/NavBar";
import { validateResetToken, updatePassword } from "../../services/auth";
import queryString from "query-string";
import CardTitle from "../../components/CardTitle";
import { Button, TextField, Box } from "@material-ui/core";
import { toast } from "react-toastify";

const ChangePassword = ({ location, history, ...props }) => {
  const [token, setToken] = useState("");
  const [password, setPassword] = useState({ password: "", confirm: "" });
  const { token: resetToken, id } = queryString.parse(location.search);
  useEffect(() => {
    async function validateToken() {
      try {
        const { data } = await validateResetToken({ token: resetToken, id });
        setToken(data.token);
      } catch (err) {
        window.location.href = '/'
      }
    }
    if (resetToken && id) {
      validateToken();

    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChangePassword = async () => {
    const { data } = await updatePassword(password.password, token);
    if (data.success) {
      toast.success("Your password is updated", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      history.push("/login")
    }
  };
  return (
    <>
      <Navbar history={history} />
      {token && (
        <CardTitle
          title="Please set your new password"
          body={
            <>
              <Box pt={2}>
                <TextField
                  style={{ width: "100%" }}
                  required
                  id="outlined-required"
                  type="password"
                  variant="outlined"
                  value={password.password}
                  onChange={(e) =>
                    setPassword({ ...password, password: e.target.value })
                  }
                  className="text-input"
                  placeholder="Password"
                />
              </Box>
              <Box pt={2}>
                <TextField
                  style={{ width: "100%" }}
                  required
                  id="outlined-required"
                  type="password"
                  variant="outlined"
                  value={password.confirm}
                  onChange={(e) =>
                    setPassword({ ...password, confirm: e.target.value })
                  }
                  className="text-input"
                  placeholder="Confirm  Password"
                />
              </Box>
              <Box pt={2}>
                <Button
                  style={{
                    width: "20%",
                    minWidth: "200px",
                    backgroundColor: "#BCBCBC",
                    color: "#000000",
                    fontSize: "15px",
                    fontWeight: "bold",
                  }}
                  variant="contained"
                  size="large"
                  color="primary"
                  onClick={handleChangePassword}
                  disabled={!password || password.password !== password.confirm}
                >
                  Change Password
                </Button>
              </Box>
            </>
          }
        />
      )}
    </>
  );
};

export default ChangePassword;
