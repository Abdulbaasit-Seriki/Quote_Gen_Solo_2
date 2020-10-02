import React, { useEffect } from "react";
import Navbar from "../../components/NavBar";
import { Box, Button, TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Template from "../../components/Template";
import { convertLead, checkLeadType } from "./helper";
import DropList from "../../components/DropList";
// import HelpModal from "../../components/Modal";
// import HelpOutlineIcon from "@material-ui/icons/HelpOutline";
import { getUserByToken } from "../../services/auth";
import { increaseEmails } from "../../services/company";
import { toast } from "react-toastify";
import Info from "./Info";
import JoditEditor from "jodit-react";

const Company = ({ history }) => {
  const classes = useStyles();
  const [lead, setLead] = React.useState("");
  const [template, setTemplate] = React.useState("");
  const [type, setType] = React.useState(1);
  // const [show, setShow] = React.useState(false);
  const [companyData, setCompanyData] = React.useState({});

  useEffect(() => {
    async function fetch() {
      const token = localStorage.getItem("token");
      const { data } = await getUserByToken(token);
      setCompanyData(data.user.company);
    }
    fetch();
  }, []);
  const changeLead = (value) => {
    setType(value);
    reset();
  };

  const reset = () => {
    //setLead("");
    setTemplate("");
  };
  const handleGenerate = () => {
    const leadType = checkLeadType(lead);
    if (leadType !== type) {
      toast.error("Wrong lead type", {
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
    const finalData = convertLead(lead, type);
    const token = localStorage.getItem("token");
    increaseEmails(token);
    setTemplate(finalData);
    if (!finalData.isOk) {
      toast.error(finalData.errors.toString(), {
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
    <div>
      <Navbar history={history} />
      <div className={classes.layout}>
        {/* <HelpOutlineIcon onClick={() => setShow(true)} /> */}
        <div className={classes.left}>
          <Info />
          <DropList
            value={1}
            options={[
              { label: "iRelocate", value: 1 },
              { label: "Moveit.ca", value: 2 },
            ]}
            onChange={changeLead}
          />
          <Box m={2} b={2} className={classes.areaContainer}>
            <JoditEditor
              className={classes.area}
              id="outlined-multiline-static"
              label="Please make sure you paste the entire lead"
              multiline
              rows="5"
              rowsMax="25"
              placeholder="Paste the lead"
              variant="outlined"
              value={lead}
              onChange={(event) => setLead(event.target.value)}
            />
          </Box>
          <Button
            disabled={!lead}
            variant="contained"
            className={classes.convert}
            size="large"
            color="primary"
            onClick={() => handleGenerate()}
          >
            Generate
          </Button>
        </div>
        <div className={classes.vl}></div>
        {template && template.isOk && (
          <Template lead={template} companyData={companyData} />
        )}
      </div>
      {/* <HelpModal show={show} onClose={() => setShow(false)} /> */}
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  area: {
    width: "100%",
  },
  areaContainer: {
    width: "90%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "200px",
    flexDirection: "column",
    padding: "10px",
  },
  left: {
    display: "flex",
    flexDirection: "column",
    width: "50%",
    alignItems: "center",
    justifyContent: "center",
  },
  convert: {
    width: "50%",
  },
  layout: {
    display: "flex",
  },
  vl: {
    borderLeft: "2px solid #cecccc",
    height: "100vh",
  },
  email: {
    width: "90%",
    height: "70vh",
    borderRadius: "7px",
    backgroundColor: "#f3f3f3",
  },
}));

export default Company;
