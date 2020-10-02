import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  AppBar,
  MenuItem,
  Toolbar,
  Typography,
  IconButton,
  Menu,
} from "@material-ui/core";
import { AccountCircle } from "@material-ui/icons";
import { useSessionDispatch } from "../context/auth";
import LOGO from "../img/logo2.png";
import { COMPANIES, ACCOUNTS, LOGS } from "../constants/adminRoutes";
import { SETTING, SHOW_ACCOUNT } from "../constants/routes";
import { toast } from "react-toastify";

const icon_margin = { marginRight: "9px" };

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

const MenuAppBar = ({ history, show = true, ...props }) => {
  const dispatchSessionState = useSessionDispatch();
  const role = localStorage.getItem("role");
  const auth = localStorage.getItem("isAuth");
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const logOut = () => {
    dispatchSessionState({
      type: "logOut",
    });
    localStorage.clear();
    toast.success("Logout Successful", {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
    return history.push("/login");
  };
  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
            onClick={() => {
              if (auth) {
                if (role === "admin") {
                  return history.push("/admin");
                } else {
                  return history.push("/company");
                }
              }
              return history.push("/");
            }}
          >
            <img src={LOGO} width="100px" alt="logo" />
            {/* <MenuIcon /> */}
          </IconButton>
          <Typography variant="h6" className={classes.title}></Typography>
          {auth && show && (
            <div>
              <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={open}
                onClose={handleClose}
              >
                {role !== "admin" ? (
                  <MenuItem onClick={() => history.push(SHOW_ACCOUNT)}>
                    <FontAwesomeIcon
                      icon="user-circle"
                      size="1x"
                      style={icon_margin}
                    />
                    Account
                  </MenuItem>
                ) : (
                    <MenuItem onClick={() => history.push(ACCOUNTS)}>
                      <FontAwesomeIcon
                        icon="user-circle"
                        size="1x"
                        style={icon_margin}
                      />
                    Accounts
                    </MenuItem>
                  )}
                <MenuItem onClick={() => history.push(SETTING)}>
                  <FontAwesomeIcon icon="cogs" size="1x" style={icon_margin} />
                  Preferences
                </MenuItem>
                <MenuItem onClick={() => logOut()}>
                  <FontAwesomeIcon
                    icon="sign-out-alt"
                    size="1x"
                    style={icon_margin}
                  />
                  Log Out
                </MenuItem>
                {role === "admin" && (
                  <div>
                    <MenuItem onClick={() => history.push(COMPANIES)}>
                      <FontAwesomeIcon
                        icon="building"
                        size="1x"
                        style={icon_margin}
                      />
                      Companies
                    </MenuItem>
                    <MenuItem onClick={() => history.push(LOGS)}>
                      <FontAwesomeIcon
                        icon="exclamation-circle"
                        size="1x"
                        style={icon_margin}
                      />
                      Logs
                    </MenuItem>
                  </div>
                )}         
                 {role === "company" && (
                  <div>
                    <MenuItem onClick={() => history.push(LOGS)}>
                      <FontAwesomeIcon
                        icon="exclamation-circle"
                        size="1x"
                        style={icon_margin}
                      />
                      Logs
                    </MenuItem>
                  </div>
                )}           
              </Menu>
            </div>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
};
export default MenuAppBar;
