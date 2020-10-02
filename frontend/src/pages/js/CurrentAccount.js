import React, { useState, useEffect, useRef } from "react";
import Navbar from "../../components/NavBar";
import { Chip, Box } from "@material-ui/core";
import { updatePrice, sendEmail } from "../../services/company";
import { getUserByToken } from "../../services/auth";
import { componentWidth } from "../../constants/style";
import {
  Button,
  TextField,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@material-ui/core";
import { toast } from "react-toastify";
import styled from "styled-components";
import JoditEditor from "jodit-react";

const Prices = styled.div`
  margin-top: 25px;
  margin-bottom: 25px;
  display: flex;
  @media (min-width: 768px) {
    flex-direction: cloumn;
  }
`;

const isMobile = window.innerWidth <= 780;

const Setting = ({ location, history, ...props }) => {
  const editor = useRef(null);
  const role = localStorage.getItem("role");
  const [open, setOpen] = React.useState(false);
  const [testEmail, setTestEmail] = React.useState("");
  const [formData, setFormData] = useState({
    prices: "",
    template: "",
  });
  useEffect(() => {
    const isAuth = localStorage.getItem("isAuth");
    const token = localStorage.getItem("token");
    async function fetch() {
      const { data } = await getUserByToken(token);
      setFormData({ ...formData, template: data?.user?.company.template });
    }
    if (!isAuth) {
      return history.push("/");
    }
    fetch();

    // eslint-disable-next-line
  }, []);

  const handleUpdatePrice = async () => {
    const { prices, template } = formData;
    const token = localStorage.getItem("token");
    const company = localStorage.getItem("company");
    const id = localStorage.getItem("id");
    const sendingData = new FormData();
    sendingData.append("prices", prices);
    sendingData.append("template", template);
    sendingData.append("currentUserCompany", company);
    sendingData.append("currentUser", id);
    const res = await updatePrice(sendingData, token);
    if (res) {
      toast.success("your account is completed successfully", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      window.location.reload(false);
    }
  };

  const sendTestEmail = async () => {
    const token = localStorage.getItem("token");
    const { data } = await sendEmail(token, {
      email: testEmail,
      html: formData.template,
    });
    if (data.done) {
      toast.success("Email sent", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
      });
      setOpen(false);
    }
  };

  return (
    <>
      <Navbar history={history} />
      <Box m={componentWidth}>
        {role === "company" && (
          <>
            <Grid
              style={{
                width: isMobile ? "100%" : "50%",
                margin: "auto",
                marginBottom: "100px",
              }}
            >
              <h1>Update Your Account Information</h1>
              <hr />
              <br></br>
              Upload New Prices Sheet:
              <Prices>
                <input
                  accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,.csv"
                  style={{ display: "none" }}
                  id="upload-prices"
                  type="file"
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      prices: event.target.files[0],
                    })
                  }
                />

                <label htmlFor="upload-prices">
                  <Button variant="contained" color="primary" component="span">
                    Upload
                  </Button>
                </label>

                {formData.prices && (
                  <Chip
                    style={{ maxWidth: "200px" }}
                    label={formData.prices.name}
                    onDelete={() => setFormData({ ...formData, prices: "" })}
                  />
                )}
              </Prices>
              <p style={{ fontSize: "1.1rem" }}>
                {" "}
                We understand that business changes all the time.
              </p>
              <p style={{ fontSize: "1.1rem" }}>
                {" "}
                If you would like to update your existing prices, simply click
                the button below to upload a new Excel file.{" "}
              </p>
              <p style={{ fontSize: "1.1rem" }}>
                {" "}
                If you would like a copy of your current price sheet, click
                here.{" "}
              </p>
              <br />
              <div style={{ marginBottom: "10px", marginTop: "10px" }}>
                <JoditEditor
                  ref={editor}
                  config={{ readonly: false }}
                  tabIndex={1}
                  // onBlur={(newContent) =>
                  //   setFormData({ ...formData, template: newContent })
                  // }
                  value={formData.template}
                  onChange={(newContent) =>
                    setFormData({ ...formData, template: newContent })
                  }
                />
              </div>
              <div
                style={{
                  display: "flex",
                  margin: "auto",
                  justifyContent: "space-between",
                }}
              >
                <Button
                  style={{
                    width: "20%",
                    minWidth: "300px",
                    backgroundColor: "green",
                    color: "#FFFFFF",
                    fontSize: "15px",
                    fontWeight: "bold",
                  }}
                  variant="contained"
                  size="large"
                  color="primary"
                  onClick={handleUpdatePrice}
                >
                  Update account
                </Button>
              </div>
            </Grid>
          </>
        )}
      </Box>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Send Test Email</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Email Address"
            type="email"
            fullWidth
            onChange={(e) => setTestEmail(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={sendTestEmail} color="primary">
            Send
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Setting;
