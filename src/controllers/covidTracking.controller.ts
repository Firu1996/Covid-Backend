import { RequestHandler, Request } from "express";
import { BaseController } from "./abstract/BaseController";
import axios from "axios";
import { redis } from "../utils/redis";

type DailyResponse = {
  txn_date: string;
  new_case: number;
  total_case: number;
  new_case_excludeabroad: number;
  total_case_excludeabroad: number;
  new_death: number;
  total_death: number;
  new_recovered: number;
  total_recovered: number;
  update_date: string;
};

type DailyResponseByProvinces = {
  txn_date: string;
  province: string;
  new_case: number;
  total_case: number;
  new_case_excludeabroad: number;
  total_case_excludeabroad: number;
  new_death: number;
  total_death: number;
  new_recovered: number;
  total_recovered: number;
  update_date: string;
};

export class covidTrackingController extends BaseController {
  constructor() {
    super();
  }

  test(): RequestHandler {
    return async (req, res, next) => {
      this.responseData = { success: true, msg: "Testing route" };
      res.locals = { ...this.responseData };
      res.status(200).send(res.locals);
    };
  }

  fetchCovidTotalDaily(): RequestHandler {
    return async (req, res) => {
      let data = await redis.get("CovidDaily");
      if (data === null) {
        try {
          const fetch = await axios.get(`${process.env.API_Total_Daily}`);
          data = fetch.data;
          await redis.set("CovidDaily", JSON.stringify(data));
          await redis.expire("CovidDaily", 10);
          console.log("No cache");
          this.responseData = { success: true, data };
          res.locals = { ...this.responseData };

          res.send(res.locals);
        } catch (error: any) {
          this.responseData = { success: false, msg: error.message };
          res.locals = { ...this.responseData };
          res.send(res.locals);
        }
      } else {
        console.log("Have a cache");
        const cache = JSON.parse(data);
        this.responseData = { success: true, data: cache };
        res.locals = { ...this.responseData };
        res.send(res.locals);
      }

      // try {
      // } catch (err: any) {
      //   this.responseData = { success: false, msg: err.message };
      //   res.locals = { ...this.responseData };
      //   res.send(res.locals);
      // }
    };
  }

  fetchCovidTotalDailyByProvices(): RequestHandler {
    return async (req, res) => {
      let data = await redis.get("CovidDailyByProvinces");
      if (data === null) {
        try {
          const fetch = await axios.get(`${process.env.API_Total_Daily_PROVINCES}`);
          data = fetch.data;
          await redis.set("CovidDailyByProvinces", JSON.stringify(data));
          await redis.expire("CovidDailyByProvinces", 10);
          console.log("No cache");
          this.responseData = { success: true, data };
          res.locals = { ...this.responseData };
          res.send(res.locals);
        } catch (error: any) {
          this.responseData = { success: false, msg: error.message };
          res.locals = { ...this.responseData };
          res.send(res.locals);
        }
      } else {
        console.log("Have a cache");
        const cache = JSON.parse(data);
        this.responseData = { success: true, data: cache };
        res.locals = { ...this.responseData };
        res.send(res.locals);
      }
    };
  }
}
