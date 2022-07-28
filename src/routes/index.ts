import { Router } from "express";
import { checkHealthRouter } from "./checkHeath.route";
import { covidTrackingRouter } from "./covidTracking.route";
export const apiRoute = Router();

apiRoute.use("/api", checkHealthRouter);
apiRoute.use("/api", covidTrackingRouter);
