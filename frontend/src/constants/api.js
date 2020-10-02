// ${process.env.REACT_APP_DOMAIN} -> Change this instead of route

// export const DOMAIN = `https://immoving.biz/api/`;
export const DOMAIN = `http://localhost:8888/api/`;
//---------------------  Users  ------------------------//
export const SIGNUP = `${DOMAIN}users/`;
export const LOGIN = `${DOMAIN}users/login`;
export const VALIDATE = `${DOMAIN}users/validate`;
export const RESET_PASSWORD = `${DOMAIN}users/resetPassword`;
export const UPDATE_PASSWORD = `${DOMAIN}users/updatePassword`;
export const VALID_RESET_PASSWORD = `${DOMAIN}users/validResetPassword`;
export const GMAILAUTH = `${DOMAIN}users/loginViaGmail`;
export const CHECKSESSION = `${DOMAIN}users/checkSession`;
export const ALL_USERS = `${DOMAIN}users/`;
export const CREATE_USER = `${DOMAIN}users/employee`;
export const DELETE_ACCOUNT = `${DOMAIN}users/delete`;
export const DELETE_USER = `${DOMAIN}users/deleteuser`;
export const CHECK_PASSWORD = `${DOMAIN}users/checkPassword`;
export const ALL_EMPOLYEE = `${DOMAIN}users/allEmployees`;
//---------------------  Companies  ------------------------//
export const ALL_COMPANIES = `${DOMAIN}companies`;
export const CREATECOMPANY = `${DOMAIN}company`;
export const COMPLETEPROFILE = `${DOMAIN}company/profile`;
export const RESEND_VALIDATE = `${DOMAIN}company/resendValidateEmail`;
export const UPDATE_PRICE = `${DOMAIN}company/updatePrices`;
export const ONE_COMPANY = `${DOMAIN}company/`;
export const TEST_MAIL = `${DOMAIN}company/sendTestEmail`;
export const GET_PRICES = `${DOMAIN}company/getPrices`;
export const INCREASE=   `${DOMAIN}company/increase`;
//---------------------  Mail  ------------------------//
export const MAIL = `${DOMAIN}mail`;
//---------------------  Logs  ------------------------//
export const ALL_LOGS = `${DOMAIN}users/logs`;
// export const ALL_LOGS = `${DOMAIN}logs`;
