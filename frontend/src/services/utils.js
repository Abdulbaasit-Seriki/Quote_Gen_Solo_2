import axios from "axios";
import { toast } from "react-toastify";

export const interceptors = () => {
  let requestUrl = "";

  let toastStyles = (message) => {
    toast.error(message, {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  axios.interceptors.request.use((request) => {
    let url = request.url.split("/");
    requestUrl = url[url.length - 1];
    return request;
  });

  axios.interceptors.response.use(
    (response) => {
      return response;
    },
    (err) => {
      switch (requestUrl) {
        case "login":
          toastStyles(
            "Either you don't have an account or your input is incorrect."
          );
          break;
        case "loginViaGmail":
          toastStyles("This email is used before.");

          break;
        case "employee":
          toastStyles("This email is used before.");

          break;
        case "resetPassword":
          toastStyles("This email is not exist.");
          break;
        case "delete":
          toastStyles("Something is wrong please try again later.");

          break;
        case "updatePassword":
          toastStyles("Something is wrong please try again later.");
          break;
        default:
          break;
      }
    }
  );
};
