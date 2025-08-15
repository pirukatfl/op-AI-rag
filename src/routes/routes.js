import { Router } from "express"
import HelpCenterController from "../modules/zendesk/helpCenterController.mjs"
import instanceAxios from './../services/axios.mjs'

const router = Router()
const helpCenterController = new HelpCenterController(instanceAxios);
router.get('/', (req, res, next) => {
    helpCenterController.getAllArticles(req, res, next)
});

export default router