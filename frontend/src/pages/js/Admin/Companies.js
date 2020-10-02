import React, { useEffect, useState } from "react";
import NavBar from "../../../components/NavBar";
import MUIDataTable from "mui-datatables";
import { Box } from "@material-ui/core";
import { getAllCompanies } from "../../../services/company";
import Modal from "@material-ui/core/Modal";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import { getCompanyById } from "../../../services/company";
import { red } from "@material-ui/core/colors";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import { deleteUser } from "../../../services/users";
import CardActions from "@material-ui/core/CardActions";
import IconButton from "@material-ui/core/IconButton";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import { CREATE_COMPANY } from "../../../constants/adminRoutes";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    maxWidth: 460,
    margin: "auto",
    backgroundColor: theme.palette.background.paper,
    marginTop: "50px",
  },
  media: {
    height: 0,
    paddingTop: "56.25%", // 16:9
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: "rotate(180deg)",
  },
  avatar: {
    backgroundColor: red[500],
  },
}));
const Companies = ({ history }) => {
  const classes = useStyles();

  const [open, setOpen] = React.useState(false);
  const [company, setCompany] = useState({ company: {}, userId: "" });
  const onDelete = () => {
    const token = localStorage.getItem("token");
    deleteUser(token, { id: company.userId });
    setData(data.filter((_) => _._id !== company.company._id));
    setOpen(false);
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
      name: "name",
      label: "Name",
      options: {
        filter: true,
        sort: false,
        customBodyRender: (name) =>
          name.charAt(0).toUpperCase() + name.slice(1),
      },
    },
    {
      name: "orgName",
      label: "Organization name",
      options: {
        filter: true,
        sort: false,
        customBodyRender: (orgName) =>
          orgName.charAt(0).toUpperCase() + orgName.slice(1),
      },
    },
    {
      name: "phone",
      label: "Phone",
      options: {
        filter: true,
        sort: false,
        customBodyRender: (phone) =>
          phone ? "(" + phone[1] + ") " + phone[2] + "-" + phone[3] : "N/A",
      },
    },
    {
      name: "logo",
      label: "Logo",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (img) =>
          img ? <img alt="logo" src={img} width="40px" onError /> : "N/A",
      },
    },
  ];
  const onRowClick = async (row) => {
    const token = localStorage.getItem("token");
    const { data } = await getCompanyById(token, row[0]);
    setCompany(data);
    setOpen(true);
  };
  const options = {
    searchPlaceholder: "Search for Email",
    filter: false,
    responsive: "scroll",
    selectableRows: "none",
    onRowClick,
    customToolbar: () => {
      return (
        <div>
          <Fab
            color="primary"
            aria-label="add"
            onClick={() => history.push(CREATE_COMPANY)}
            size="small"
            style={{ backgroundColor: "#096532" }}
          >
            <AddIcon />
          </Fab>
        </div>
      );
    },
  };
  const [data, setData] = useState([]);
  useEffect(() => {
    async function fetch() {
      const token = localStorage.getItem("token");
      const { data } = await getAllCompanies(token);
      setData(data.companies);
    }
    fetch();
  }, []);
  return (
    <>
      <NavBar history={history} />
      <Box p={2}>
        <MUIDataTable
          title={"All Companies"}
          data={data}
          columns={columns}
          options={options}
        />
      </Box>
      {open && (
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
        >
          <Card className={classes.root}>
            <CardHeader
              avatar={<Avatar alt="Remy Sharp" src={company.company.logo} />}
              action={
                <IconButton aria-label="settings">
                  <FontAwesomeIcon
                    icon="trash"
                    color="red"
                    size="x"
                    onClick={() => onDelete()}
                  />
                </IconButton>
              }
              title={company.company.name}
              subheader={company.company.email}
            />

            <CardActions disableSpacing>
              <div className={classes.section3}>
                <a href={company.company.prices}>
                  <Button>Prices</Button>
                </a>
              </div>
            </CardActions>
          </Card>
        </Modal>
      )}
    </>
  );
};

export default Companies;
