import axios from "axios";
import {
  ALL_COMPANIES,
  COMPLETEPROFILE,
  CREATECOMPANY,
  ONE_COMPANY,
  UPDATE_PRICE,
  TEST_MAIL,
  RESEND_VALIDATE,
  INCREASE
} from "../constants/api";

export const getAllCompanies = async (token) => {
  return await axios.get(ALL_COMPANIES, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
};

export const createCompany = async (companyInfo) => {
  return axios.post(CREATECOMPANY, companyInfo);
};

export const completeProfile = async (data, token) => {
  return await axios.post(COMPLETEPROFILE, data, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
};
export const resendValidateEmail  = async(token)=>{
  return await axios.post(RESEND_VALIDATE, {}, {
    headers: {
      Authorization: "Bearer " + token,
    },
  })
  
}
export const updatePrice = async (data, token) => {
  return await axios.post(UPDATE_PRICE, data, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
};

export const getCompanyById = async (token, id) => {
  return await axios.get(ONE_COMPANY + id, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
};

export const sendEmail = async (token, { email, html }) => {
  return await axios.post(
    TEST_MAIL,
    { email, html },
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );
};


export const increaseEmails = async (token) => {
  return await axios.post(
    INCREASE,
    {},
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );
};
