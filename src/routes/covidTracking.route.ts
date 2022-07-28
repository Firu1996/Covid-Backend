import { Router, Request, Response } from "express";
import { covidTrackingController } from "../controllers/covidTracking.controller";
export const covidTrackingRouter = Router();
const covidtrackingController = new covidTrackingController();

covidTrackingRouter.get("/test", covidtrackingController.test());
covidTrackingRouter.get("/getdaily", covidtrackingController.fetchCovidTotalDaily());
covidTrackingRouter.get("/getdaily-provinces", covidtrackingController.fetchCovidTotalDailyByProvices());
