import { Router } from "express"
import HelpCenterModule from "../modules/zendesk/helpCenterModule.mjs"
import instanceAxios from './../services/axios.mjs'

const router = Router()
const helpCenterModule = new HelpCenterModule(instanceAxios);
router.get('/', (req, res, next) => {
    helpCenterModule.getAllArticles(req, res, next)
});

export default router