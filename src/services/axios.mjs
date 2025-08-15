import axios from "axios"
import https from "https"
import dotenv from 'dotenv'
dotenv.config()

const agent = new https.Agent({
    rejectUnauthorized: false
});
const auth = {
    username: `${process.env.ZENDESK_USERNAME}/token`,
    password: process.env.ZENDESK_TOKEN,
}

const instanceAxios = axios.create({
    baseURL: 'https://operandsupport.zendesk.com/api/v2/help_center/',
    auth
})

export default instanceAxios;
