import React, { useState, useEffect } from "react";
import { deleteAccount } from "../../../services/auth";
import { getAllEmpolyees } from "../../../services/users";
import { deleteUser } from "../../../services/users";
import {
  Button,
  Box,
  ListItem,
  Avatar,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@material-ui/core";
import { toast } from "react-toastify";
import * as Routers from "../../../constants/routes";
import FolderIcon from "@material-ui/icons/SupervisedUserCircleRounded";
import { confirmAlert } from "react-confirm-alert";
import DeleteIcon from "@material-ui/icons/Delete";
import { makeStyles } from "@material-ui/core/styles";

const isMobile = window.innerWidth <= 780;

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    maxWidth: 752,
  },
  title: {
    margin: theme.spacing(4, 0, 2),
  },
  list: {
    backgroundColor: "#FFFFFF",
    marginBottom: "10px",
    width: "45%",
  },
}));

const UpdateAccount = ({ history }) => {
  const classes = useStyles();
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const isAuth = localStorage.getItem("isAuth");
    async function fetch() {
      const { data } = await getAllEmpolyees(token);
      setEmployees(data.users);
    }
    if (!isAuth) {
      history.push("/");
    }
    if (role === "company") {
      fetch();
    }
    // eslint-disable-next-line
  }, []);
  const handleDeleteUser = async (id) => {
    confirmAlert({
      title: "Confirm to delete",
      message: "Are you sure you want to delete this account?",
      buttons: [
        {
          label: "I'm sure",
          onClick: async () => {
            const token = localStorage.getItem("token");
            const { data } = await deleteUser(token, { id });
            if (data) {
              const newEmployees = employees.filter((e) => e._id !== id);
              setEmployees(newEmployees);
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

  const handleDeleteAccount = async () => {
    confirmAlert({
      title: "Confirm to submit",
      message: "Are you sure to do this.",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            const token = localStorage.getItem("token");

            deleteAccount(token).then(({ data }) => {
              if (data.success) {
                localStorage.clear();
                toast.success("Delete Account Successful", {
                  position: "bottom-right",
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: false,
                  pauseOnHover: false,
                  draggable: false,
                  progress: undefined,
                });
                return history.push("/login");
              }
            });
          },
        },
        {
          label: "No",
          onClick: () => {},
        },
      ],
    });
  };
  return (
    <>
      {role === "company" && (
        <>
          <div
            style={{
              display: "flex",
              margin: "auto",
              alignItems: "space-between",
              marginTop: "20px",
              paddingBottom: "20px",
            }}
          >
            <Box
              pt={2}
              style={{ width: isMobile ? "100%" : "50%", margin: "auto" }}
            >
              <Button
                style={{
                  width: "80%",
                  minWidth: "200px",
                  color: "#FFFFFF",
                  fontSize: "15px",
                  fontWeight: "bold",
                }}
                variant="contained"
                size="large"
                color="primary"
                onClick={() => history.push(Routers.ACCOUNT)}
              >
                Create User
              </Button>
            </Box>
            <Box
              pt={2}
              style={{ width: isMobile ? "100%" : "50%", margin: "auto" }}
            >
              <Button
                style={{
                  width: "80%",
                  minWidth: "200px",
                  color: "#FFFFFF",
                  fontSize: "15px",
                  fontWeight: "bold",
                }}
                variant="contained"
                size="large"
                color="secondary"
                onClick={handleDeleteAccount}
              >
                Delete My Account
              </Button>
            </Box>
          </div>
          <hr />
          {employees.length > 0 && (
            <div style={{ textAlign: "center" }}>
              <Typography variant="h6" className={classes.title}>
                All Employees
              </Typography>
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                }}
              >
                {employees.map((employee, index) => {
                  return employee.isDeleted ? (
                    <ListItem key={index} className={classes.list}>
                      <ListItemAvatar>
                        <Avatar>
                          <FolderIcon />
                        </Avatar>
                      </ListItemAvatar>
                      {/* Changed text opacity to show that this user has been soft deleted */}
                      <ListItemText
                        style={{ opacity: 0.3 }}
                        primary={employee.email}
                        secondary={`number of logins ${employee.numLogin}`}
                      />
                      <DeleteIcon
                        style={{ pointerEvents: "none", opacity: 0.3 }}
                        onClick={() => handleDeleteUser(employee._id, index)}
                      />
                    </ListItem>
                  ) : (
                    <ListItem key={index} className={classes.list}>
                      <ListItemAvatar>
                        <Avatar>
                          <FolderIcon />
                        </Avatar>
                      </ListItemAvatar>
                      {/* Changed text opacity to show that this user has been soft deleted */}
                      <ListItemText
                        primary={employee.email}
                        secondary={`number of logins ${employee.numLogin}`}
                      />
                      <DeleteIcon
                        onClick={() => handleDeleteUser(employee._id, index)}
                      />
                    </ListItem>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};
export default UpdateAccount;
