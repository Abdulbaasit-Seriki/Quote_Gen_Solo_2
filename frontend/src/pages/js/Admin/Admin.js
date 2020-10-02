import React from "react";
import Navbar from "../../../components/NavBar";
import DropList from "../../../components/DropList";
import { Box, Button, TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Template from "../../../components/Template";
import { getAllCompanies } from "../../../services/company";
import { convertLead, checkLeadType } from "../helper";
import { toast } from "react-toastify";
import { getCompanyById } from "../../../services/company";

const Admin = ({ history }) => {
  const classes = useStyles();
  const [lead, setLead] = React.useState("");
  const [type, setType] = React.useState(1);
  const [template, setTemplate] = React.useState("");
  const [companies, setCompanies] = React.useState([]);
  const [selectedCopaamy, setSelectedCompany] = React.useState(false);
  const toastConfig = {
    position: "bottom-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  };

  React.useEffect(() => {
    async function fetch() {
      const token = localStorage.getItem("token");
      const data = await getAllCompanies(token);
      setCompanies(data.data.companies);
    }
    fetch();
  }, []);

  const changeLead = (value) => {
    setType(value);
    reset();
  };
  const changeCompany = async (id) => {
    if (!id) {
      setSelectedCompany("");
    } else {
      const token = localStorage.getItem("token");
      const { data } = await getCompanyById(token, id);
      setSelectedCompany(data.company);
    }
    reset();
  };
  const reset = () => {
    setLead("");
    setTemplate("");
  };
  const handleGenerate = () => {
    const leadType = checkLeadType(lead);
    if (leadType !== type) {
      toast.error("Wrong lead type", toastConfig);
      return;
    }
    const finalData = convertLead(lead, type);
    setTemplate(finalData);
    if (!finalData.isOk) {
      toast.error(finalData.errors.toString(), toastConfig);
    }
  };
  return (
    <div>
      <Navbar history={history} />
      <div className={classes.layout}>
        <div className={classes.left}>
          <DropList
            value={1}
            options={[
              { label: "iRelocate", value: 1 },
              { label: "Moveit.ca", value: 2 },
            ]}
            onChange={changeLead}
          />

          <DropList
            hasNone
            options={companies?.map((company) => {
              return {
                label: company.name + " - " + company.orgName,
                value: company._id,
              };
            })}
            onChange={changeCompany}
          />

          <Box m={2} b={2} className={classes.areaContainer}>
            <TextField
              className={classes.area}
              id="outlined-multiline-static"
              label="Lead"
              multiline
              rows="5"
              rowsMax="25"
              value={lead}
              placeholder="Paste the lead"
              variant="outlined"
              onChange={(event) => setLead(event.target.value)}
            />
          </Box>
          <Button
            disabled={!lead || !selectedCopaamy}
            variant="contained"
            className={classes.convert}
            size="large"
            color="primary"
            onClick={() => handleGenerate()}
          >
            {" "}
            Generate
          </Button>
        </div>
        <div className={classes.vl}></div>
        {template && template.isOk && (
          <Template lead={template} companyData={selectedCopaamy} />
        )}
      </div>
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

export default Admin;
