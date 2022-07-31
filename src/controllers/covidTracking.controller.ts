import { RequestHandler, Request } from "express";
import { BaseController } from "./abstract/BaseController";
import axios from "axios";
import { redis } from "../utils/redis";
import { calulateExpire } from "../utils/calulateExpire";
import { provinceEnObject, TypeProvinceEnObject } from "../locale/provinceMap";
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

type DailyByProvinces = {
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

type DailyResponseByProvinces = {
  success: boolean;
  data: DailyByProvinces[] | null;
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
          const redisExpire = calulateExpire();
          await redis.set("CovidDaily", JSON.stringify(data));
          await redis.expire("CovidDaily", redisExpire);
          console.log("No cache - CovidDaily");
          this.responseData = { success: true, data };
          res.locals = { ...this.responseData, redisExpire };
          res.send(res.locals);
        } catch (error: any) {
          this.responseData = { success: false, msg: error.message };
          res.locals = { ...this.responseData };
          res.send(res.locals);
        }
      } else {
        console.log("Have a cache - CovidDaily");
        const cache = JSON.parse(data);
        this.responseData = { success: true, data: cache };
        res.locals = { ...this.responseData };
        res.send(res.locals);
      }
    };
  }

  fetchCovidTotalDailyByProvices(): RequestHandler {
    return async (req, res) => {
      let dataRedis = await redis.get("CovidDailyByProvinces");
      if (dataRedis === null) {
        try {
          const fetch = await axios.get(`${process.env.API_Total_Daily_PROVINCES}`);
          let data = fetch.data;
          const redisExpire = calulateExpire();
          let newData = null;
          if (data) {
            newData = data.map((old: DailyByProvinces) => {
              let newObj = old;

              provinceEnObject.forEach((obj: TypeProvinceEnObject) => {
                if (old.province === obj.province) {
                  newObj = Object.assign({}, newObj, { provinceEn: obj.provinceEn });
                }
              });

              return newObj;
            });
          }
          await redis.set("CovidDailyByProvinces", JSON.stringify(newData));
          await redis.expire("CovidDailyByProvinces", redisExpire);
          console.log("No cache - CovidDailyByProvinces");
          this.responseData = { success: true, data: newData };
          res.locals = { ...this.responseData, redisExpire };
          res.send(res.locals);
        } catch (error: any) {
          this.responseData = { success: false, msg: error.message };
          res.locals = { ...this.responseData };
          res.send(res.locals);
        }
      } else {
        console.log("Have a cache - CovidDailyByProvinces");
        const cache = JSON.parse(dataRedis);
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
      await redis.del("CovidDailyChart");
      this.responseData = { success: true, msg: "Redis was cleared" };
      res.locals = { ...this.responseData };
      res.status(200).send(res.locals);
    };
  }

  fetchDailyForChart(): RequestHandler {
    return async (req, res) => {
      let data = await redis.get("CovidDailyChart");
      if (data === null) {
        try {
          const fetch = await axios.get(`${process.env.API_Total_Chart}`);
          data = fetch.data;
          const redisExpire = calulateExpire();
          await redis.set("CovidDailyChart", JSON.stringify(data));
          await redis.expire("CovidDailyChart", redisExpire);
          console.log("No cache - CovidDailyChart");
          this.responseData = { success: true, data };
          res.locals = { ...this.responseData, redisExpire };
          res.send(res.locals);
        } catch (error: any) {
          this.responseData = { success: false, msg: error.message };
          res.locals = { ...this.responseData };
          res.send(res.locals);
        }
      } else {
        console.log("Have a cache - CovidDailyChart");
        const cache = JSON.parse(data);
        this.responseData = { success: true, data: cache };
        res.locals = { ...this.responseData };
        res.send(res.locals);
      }
    };
  }
}
