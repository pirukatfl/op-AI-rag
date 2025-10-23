import axios from "axios"
import dotenv from 'dotenv'
dotenv.config()

const auth = {
    username: `${process.env.ZENDESK_USERNAME}/token`,
    password: process.env.ZENDESK_TOKEN,
}

const instanceAxios = axios.create({
    baseURL: process.env.BASE_URL_ZENDESK,
    auth
})

export default instanceAxios;
