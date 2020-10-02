import axios from "axios";
import { ALL_LOGS} from "../constants/api";

export const getAllLogs = async (token) => {
  return await axios.get(ALL_LOGS, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
};


