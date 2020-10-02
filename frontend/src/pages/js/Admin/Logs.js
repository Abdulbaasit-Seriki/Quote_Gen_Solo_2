import React, { useEffect, useState } from "react";
import NavBar from "../../../components/NavBar";
import MUIDataTable from "mui-datatables";
import { Box } from "@material-ui/core";
import { getAllLogs } from "../../../services/logs";
import { componentWidth } from "../../../constants/style";

const Logs = ({ history }) => {
  const options = {
    searchPlaceholder: "Search for Email",
    filter: false,
    responsive: "scroll",
    selectableRows: "none",
  };
  const columns = [
    {
      name: "date",
      label: "Date",
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
      name: "event",
      label: "Event",
      options: {
        filter: true,
        sort: false,
      },
    },
  ];

  const [data, setData] = useState({ logs: [] });
  useEffect(() => {
    async function fetch() {
      const token = localStorage.getItem("token");
      const { data } = await getAllLogs(token);
      setData(data);
    }
    fetch();
  }, []);

  return (
    <>
      <NavBar history={history} />
      <Box m={componentWidth}>
        <MUIDataTable
          title={"All Accounts"}
          data={data.logs}
          columns={columns}
          options={options}
        />
      </Box>
    </>
  );
};

export default Logs;
