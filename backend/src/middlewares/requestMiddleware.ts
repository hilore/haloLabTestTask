import {Request, Response, NextFunction} from "express";

function checkRequestMiddleware(req: Request, res: Response, next: NextFunction) {
  const incrementMin = Number(process.env.INCREMENT_MIN);
  const incrementMax = Number(process.env.INCREMENT_MAX);
  const nonNumberCoordRes = {
    status: false,
    message: "Coordinate must be a number"
  };
  const incorrectIncRes = {
    success: false,
    message: `Increment value should fit into [${incrementMin}; ${incrementMax}] range`
  };

  if (!req.body) {
    return res.status(400).json({
      status: false,
      message: "At least one of coordinate should be specified"
    });
  }

  if (Object.keys(req.body).length > 3) {
    return res.status(400).json({
      status: false,
      message: "Only x, y and z coordinates could be specified"
    });
  }

  const {x, y, z} = req.body;
  if (x) {
    if (typeof x != "number") {
      return res.status(400).json(nonNumberCoordRes);
    } else {
      if (x < incrementMin || x > incrementMax) {
        return res.status(400).json(incorrectIncRes);
      }
    }
  }

  if (y) {
    if (typeof y != "number") {
      return res.status(400).json(nonNumberCoordRes);
    } else {
      if (y < incrementMin || y > incrementMax) {
        return res.status(400).json(incorrectIncRes);
      }
    }
  }

  if (z) {
    if (typeof z != "number") {
      return res.status(400).json(nonNumberCoordRes);
    } else {
      if (z < incrementMin || z > incrementMax) {
        return res.status(400).json(incorrectIncRes);
      }
    }
  }

  next();
}

export default checkRequestMiddleware;
