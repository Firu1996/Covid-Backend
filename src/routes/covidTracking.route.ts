import { Router, Request, Response } from "express";
import { covidTrackingController } from "../controllers/covidTracking.controller";
export const covidTrackingRouter = Router();
const covidtrackingController = new covidTrackingController();

covidTrackingRouter.get("/clear-redis", covidtrackingController.clearRedis());
covidTrackingRouter.get("/getdaily", covidtrackingController.fetchCovidTotalDaily());
covidTrackingRouter.get("/getdaily-provinces", covidtrackingController.fetchCovidTotalDailyByProvices());
covidTrackingRouter.get("/getdaily-chart", covidtrackingController.fetchDailyForChart());
