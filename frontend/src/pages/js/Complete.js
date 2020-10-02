import React, { useState, useRef } from "react";
import {
  Button,
  Chip,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@material-ui/core";
import { completeProfile, sendEmail } from "../../services/company";
import Navbar from "../../components/NavBar";
import styled from "styled-components";
import { toast } from "react-toastify";
import JoditEditor from "jodit-react";
import isImage from "is-image";

const OuterDiv = styled.div`
  display: flex;
  flex-direction: column;
  width: 80%;
  margin: auto;
  max-width: 750px;
  padding: 20px;
  background-color: #fff;
  padding-top: 20px;
  border-radius: 7px;
  margin-top: 50px;
`;
const Logo = styled.div`
  display: flex;
  margin-top: 25px;
  margin-bottom: 25px;
`;
const Prices = styled.div`
  margin-top: 25px;
  margin-bottom: 25px;
  display: flex;
  @media (min-width: 768px) {
    flex-direction: cloumn;
  }
`;
const Complete = ({ history }) => {
  const editor = useRef(null);
  const [open, setOpen] = React.useState(false);
  const [testEmail, setTestEmail] = React.useState("");
  const [formData, setFormData] = useState({
    logo: "",
    prices: "",
    template: "",
  });

  // Image validation
  const ImgValidate = (event) => {
    if (!isImage(event.target.files[0].name)) {
      toast.error("Please Upload a Valid Image", {
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

  const handleComplete = async () => {
    const errors = isValidate();
    if (errors.length) {
      toast.error(errors.toString(), {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }
    const { logo, prices, template } = formData;
    const token = localStorage.getItem("token");
    const id = localStorage.getItem("id");
    const sendingData = new FormData();
    sendingData.append("logo", logo);
    sendingData.append("prices", prices);
    sendingData.append("template", template);
    sendingData.append("currentUser", id);
    const res = await completeProfile(sendingData, token);
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
  const isValidate = () => {
    const { logo, prices, template } = formData;
    const errors = [];
    if (!logo) {
      errors.push("Logo is required");
    }
    if (!prices) {
      errors.push("Prices sheet is required");
    }
    if (!template) {
      errors.push("Template name is required");
    }
    return errors;
  };
  return (
    <div>
      <Navbar history={history} />
      <OuterDiv>
        <b>Upload your company logo:</b>
        <Logo>
          <input
            accept="image/*"
            style={{ display: "none" }}
            id="upload-logo"
            type="file"
            onChange={(event) => {
              ImgValidate(event);
              setFormData({ ...formData, logo: event.target.files[0] });
            }}
          />
          <label htmlFor="upload-logo">
            <Button variant="contained" color="primary" component="span">
              Upload
            </Button>
          </label>
          {formData.logo && (
            <Chip
              style={{ maxWidth: "200px" }}
              OuterDiv
              label={formData.logo.name}
              onDelete={() => setFormData({ ...formData, logo: "" })}
            />
          )}
        </Logo>
        <br />
        <b>Upload your company’s pricing sheet:</b>
        <p>
          This will be used to generate your outgoing sales email template and
          associated prices.
        </p>
        <span>
          <a
            href={
              process.env.REACT_APP_DOMAIN + "api/getPrices/sample-pricing.xlsx"
            }
          >
            Download
          </a>{" "}
          the Sample Price Sheet and adjust prices based on your organization's
          pricing strategy
        </span>
        <p>
          Don’t worry, even after you upload you can edit your pricing as needed
        </p>
        <Prices>
          <input
            accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,.csv"
            style={{ display: "none" }}
            id="upload-prices"
            type="file"
            onChange={(event) =>
              setFormData({ ...formData, prices: event.target.files[0] })
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
        Enter a sample outgoing sales email for your organization.
        <div style={{ marginBottom: "10px", marginTop: "10px" }}>
          {/* <TextField
            id="outlined-multiline-static"
            label="Template"
            multiline
            rows={20}
            variant="outlined"
            value={formData.template}
            style={{ width: "100%" }}
            placeholder="type here ... "
            onChange={(event) =>
              setFormData({ ...formData, template: event.target.value })
            }
          /> */}
          <JoditEditor
            ref={editor}
            config={{ readonly: false }}
            value={formData.template}
            tabIndex={1}
            onBlur={(newContent) => {
              setFormData({ ...formData, template: newContent.target.innerHTML });
            }}
            //onChange={(newContent) => {
            //   setFormData({ ...formData, template: newContent });
            // }}
          />
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          {/* <Button
            style={{
              width: "20%",
              minWidth: "300px",
              backgroundColor: "#BCBCBC",
              color: "#000000",
              fontSize: "15px",
              fontWeight: "bold",
            }}
            variant="contained"
            size="large"
            color="primary"
            onClick={() => setOpen(true)}
          >
            Send Test Email
          </Button> */}
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
            onClick={handleComplete}
          >
            Complete Company Profile
          </Button>
        </div>
      </OuterDiv>
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
    </div>
  );
};

export default Complete;
