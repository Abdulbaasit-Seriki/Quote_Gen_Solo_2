import axios from "axios";
import {
  LOGIN,
  SIGNUP,
  VALIDATE,
  GMAILAUTH,
  CHECKSESSION,
  DELETE_ACCOUNT,
  CHECK_PASSWORD,
  RESET_PASSWORD,
  UPDATE_PASSWORD,
  VALID_RESET_PASSWORD,
} from "../constants/api";

export const login = async ({ email, password }) => {
  return axios.post(LOGIN, {
    email,
    password,
  });
};

export const signup = async (userInfo) => {
  return axios.post(SIGNUP, userInfo);
};

export const validate = async (userInfo) => {
  return axios.post(VALIDATE, userInfo);
};

export const resetPassword = async (email) => {
  return axios.post(RESET_PASSWORD, { email });
};
export const updatePassword = async (password, token) => {
  return axios.post(
    UPDATE_PASSWORD,
    { password },
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );
};

export const validateResetToken = async ({ token, id }) => {
  return axios.post(VALID_RESET_PASSWORD, { token, id });
};

export const loginGmail = async (userInfo) => {
  return axios.post(GMAILAUTH, userInfo);
};

export const deleteAccount = async (token) => {
  return axios.post(
    DELETE_ACCOUNT,
    {},
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );
};

export const getUserByToken = (token) => {
  return axios.post(
    CHECKSESSION,
    {},
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );
};

export const checkPassword = (password, token) => {
  return axios.post(
    CHECK_PASSWORD,
    { password },
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );
};
