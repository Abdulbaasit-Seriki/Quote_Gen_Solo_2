import { ADMIN } from "../constants/adminRoutes";
import * as Routers from "../constants/routes";

export const checkIfAuth = () => {
  const isAuth = localStorage.getItem("isAuth");
  const token = localStorage.getItem("token");
  //Just change tru to false
  return isAuth && token ? true : false;
};

export const handleUserNextStep = (user) => {
  const { valid, role, complete } = user;
  if (role === "company" || role === "employee") {
    if (complete && valid) {
      return Routers.COMPANY;
    }
    if (!valid) {
      return Routers.VALIDATE;
    }
    if (!complete) {
      return Routers.COMPLETE;
    }
  }
  if(role.localeCompare("admin") === 0){
    return ADMIN
  }
  return Routers.COMPLETE;
};
