import { Router, Request, Response } from "express";

export const checkHealthRouter = Router();

checkHealthRouter.get("/checkhealth", (req: Request, res: Response) => {
  res.send({
    health: true,
    msg: "API server is running"
  });
});
