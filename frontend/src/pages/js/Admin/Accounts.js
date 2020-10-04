import React, { useEffect, useState } from "react";
import NavBar from "../../../components/NavBar";
import MUIDataTable from "mui-datatables";
import { Box } from "@material-ui/core";
import { getAllUsers, deleteUser } from "../../../services/users";
import { COMPANY } from "../../../constants/adminRoutes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AddIcon from "@material-ui/icons/Add";
import Fab from "@material-ui/core/Fab";
import { ACCOUNT } from "../../../constants/routes";
import { confirmAlert } from "react-confirm-alert";

import { componentWidth } from "../../../constants/style";

import Grid from "@material-ui/core/Grid";
import accountStyles from "../../css/Accounts.css";

import StatsCard from "./StatsCard";

const Companies = ({ history }) => {
  const options = {
    searchPlaceholder: "Search for Email",
    filter: false,
    responsive: "scroll",
    selectableRows: "none",
    onRowClick: () => {},
    customToolbar: () => {
      return (
        <div>
          <Fab
            color="primary"
            aria-label="add"
            onClick={() => history.push(ACCOUNT)}
            size="small"
            style={{ backgroundColor: "#096532" }}
          >
            <AddIcon />
          </Fab>
        </div>
      );
    },
  };
  const columns = [
    {
      name: "_id",
      options: {
        display: "false",
      },
    },
    {
      name: "email",
      label: "Email",
      options: {
        filter: true,
        sort: true,
      },
    },

    {
      name: "role",
      label: "Role",
      options: {
        filter: true,
        sort: false,
        customBodyRender: (role) =>
          role.charAt(0).toUpperCase() + role.slice(1),
      },
    },
    {
      name: "valid",
      label: "Valid",
      options: {
        filter: true,
        sort: false,
        customBodyRender: (isValid) =>
          isValid ? (
            <FontAwesomeIcon icon="check-circle" color="#6DB65B" size="2x" />
          ) : (
            <FontAwesomeIcon icon="times-circle" color="red" size="2x" />
          ),
      },
    },
    {
      name: "complete",
      label: "Complete",
      options: {
        filter: true,
        sort: false,
        customBodyRender: (isComplete) =>
          isComplete ? (
            <FontAwesomeIcon icon="check-circle" color="#6DB65B" size="2x" />
          ) : (
            <FontAwesomeIcon icon="times-circle" color="red" size="2x" />
          ),
      },
    },
    {
      name: "provider",
      label: "Gmail",
      options: {
        filter: true,
        sort: false,
        customBodyRender: (isGmail) => (isGmail ? isGmail : "-"),
      },
    },
    {
      name: "numLogin",
      label: "Number of Logins",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "numEmail",
      label: "Number of Emails",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "company",
      label: "Associated company",
      options: {
        filter: true,
        sort: false,
        customBodyRender: (company) =>
          company ? (
            <a href={COMPANY.replace(":id", company._id)}>
              {company.name.charAt(0).toUpperCase() + company.name.slice(1)}
            </a>
          ) : (
            " - "
          ),
      },
    },
    {
      name: "role",
      label: "Action",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (role, row) => {
          const { rowData } = row;
          return role !== "admin" ? (
            <FontAwesomeIcon
              icon="trash"
              color="red"
              size="2x"
              onClick={() => onDelete(rowData[0])}
            />
          ) : (
            " - "
          );
        },
      },
    },
  ];
  const [data, setData] = useState({ users: [], numEmail: 0, mostUsed: {} });
  const [mostUsed, setMostUsed] = useState("");

  useEffect(() => {
    async function fetch() {
      const token = localStorage.getItem("token");
      const { data } = await getAllUsers(token);
      setMostUsed(data.mostUsed?.email);
      setData({ users: data?.users, numEmail: data?.emails });
    }
    fetch();
  }, []);

  const onDelete = (id) => {
    confirmAlert({
      title: "Confirm to submit",
      message: "Are you sure you want to delete this account?",
      buttons: [
        {
          label: "I'm sure",
          onClick: async () => {
            const token = localStorage.getItem("token");
            const { data } = await deleteUser(token, { id });
            if (data) {
              setData({ ...data, users: data.users });
            }
          },
        },
        {
          label: "Cancel",
          onClick: () => {},
        },
      ],
    });
  };
  return (
    <>
      <NavBar history={history} />
      <Box margin={componentWidth}>
        <div className={accountStyles.divVar}>
          <Grid container spacing={3}>
            <Grid item xs={3}>
              <StatsCard name={"Numbers of emails"} value={data.numEmail} />
            </Grid>
            <Grid item xs={3}>
              <StatsCard
                name={"Most Active User"}
                value={mostUsed}
                icon={"user"}
              />
            </Grid>
          </Grid>
        </div>
      </Box>
      <Box margin={componentWidth}>
        <MUIDataTable
          title={"All Accounts"}
          data={data.users}
          columns={columns}
          options={options}
        />
      </Box>
    </>
  );
};

export default Companies;
