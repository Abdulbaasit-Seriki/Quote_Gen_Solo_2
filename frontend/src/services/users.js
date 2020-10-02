import axios from "axios";
import {
  ALL_USERS,
  CREATE_USER,
  DELETE_USER,
  ALL_EMPOLYEE,
} from "../constants/api";

export const getAllUsers = async (token) => {
  return await axios.get(ALL_USERS, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
};

export const createEmployee = async (token, userInfo) => {
  return await axios.post(CREATE_USER, userInfo, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
};

export const deleteUser = async (token, userInfo) => {
  return await axios.post(DELETE_USER, userInfo, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
};

export const getAllEmpolyees = async (token) => {
  return await axios.get(ALL_EMPOLYEE, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
};
