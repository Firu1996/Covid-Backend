import { RequestHandler, Request } from "express";
import { BaseController } from "./abstract/BaseController";
import axios from "axios";
import { redis } from "../utils/redis";
import { calulateExpire } from "../utils/calulateExpire";

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
          const expire = calulateExpire();
          await redis.set("CovidDaily", JSON.stringify(data));
          await redis.expire("CovidDaily", expire);
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

  fetchCovidTotalDailyByProvices(): RequestHandler {
    return async (req, res) => {
      let data = await redis.get("CovidDailyByProvinces");
      if (data === null) {
        try {
          const fetch = await axios.get(`${process.env.API_Total_Daily_PROVINCES}`);
          data = fetch.data;
          const expire = calulateExpire();
          await redis.set("CovidDailyByProvinces", JSON.stringify(data));
          await redis.expire("CovidDailyByProvinces", expire);
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
  clearRedis(): RequestHandler {
    return async (req, res) => {
      await redis.del("CovidDaily");
      await redis.del("CovidDailyByProvinces");
      this.responseData = { success: true, msg: "Redis was cleared" };
      res.locals = { ...this.responseData };
      res.status(200).send(res.locals);
    };
  }
}
