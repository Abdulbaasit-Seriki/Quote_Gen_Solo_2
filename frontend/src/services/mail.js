import axios from 'axios';
import { MAIL } from '../constants/api'

export const sendEmail = async ({lead , emailTo} , token) => {

    return await axios.post(MAIL , {
        lead,
        emailTo
    },
    {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
 }
