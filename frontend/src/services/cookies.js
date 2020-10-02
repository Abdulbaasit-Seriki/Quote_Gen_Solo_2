export const setCookie = (data) => {
  localStorage.setItem("isAuth", true);
  localStorage.setItem("token", data.token);
  localStorage.setItem("role", data.user.role);
  localStorage.setItem("company", data.user.company);
  localStorage.setItem("id", data.user._id);
  localStorage.setItem("expire", new Date().getTime() / 1000 + 1800);
};
