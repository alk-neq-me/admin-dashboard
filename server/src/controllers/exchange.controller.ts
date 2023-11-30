import { NextFunction, Request, Response } from "express";
import logging from "../middleware/logging/logging";
import AppError from "../utils/appError";
import { db } from "../utils/db";
import { HttpDataResponse, HttpListResponse, HttpResponse } from "../utils/helper";
import { convertNumericStrings } from "../utils/convertNumber";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { CreateExchangeInput, CreateMultiExchangesInput, ExchangeFilterPagination, GetExchangeInput } from "../schemas/exchange.schema";


export async function getExchangesHandler(
  req: Request<{}, {}, {}, ExchangeFilterPagination>,
  res: Response,
  next: NextFunction
) {
  try {
    const { filter = {}, pagination, orderBy } = convertNumericStrings(req.query)
    const {
      id,
      from,
      to,
      endDate,
      startDate,
      rate
    } = filter || { status: undefined }
    const { page, pageSize } = pagination ??  // ?? nullish coalescing operator, check only `null` or `undefied`
      { page: 1, pageSize: 10 }

    const offset = (page - 1) * pageSize

    const [count, exchanges] = await db.$transaction([
      db.exchange.count(),
      db.exchange.findMany({
        where: {
          id,
          from,
          to,
          date: {
            lte: endDate,
            gte: startDate
          },
          rate
        },
        orderBy,
        skip: offset,
        take: pageSize,
      })
    ])

    res.status(200).json(HttpListResponse(exchanges, count))
  } catch (err: any) {
    const msg = err?.message || "internal server error"
    logging.error(msg)
    next(new AppError(500, msg))
  }
}


export async function getExchangeHandler(
  req: Request<GetExchangeInput["params"]>,
  res: Response,
  next: NextFunction
) {
  try {
    const { exchangeId } = req.params

    const exchange = await db.exchange.findUnique({
      where: {
        id: exchangeId
      }
    })

    res.status(200).json(HttpDataResponse({ exchange }))
  } catch (err: any) {
    const msg = err?.message || "internal server error"
    logging.error(msg)
    next(new AppError(500, msg))
  }
}


export async function createExchangeHandler(
  req: Request<{}, {}, CreateExchangeInput>,
  res: Response,
  next: NextFunction
) {
  try {
    const { from, to, rate, date } = req.body
    const exchange = await db.exchange.create({
      data: {
        from,
        date,
        to,
        rate
      },
    })

    res.status(200).json(HttpDataResponse({ exchange }))
  } catch (err: any) {
    const msg = err?.message || "internal server error"
    logging.error(msg)

    if (err instanceof PrismaClientKnownRequestError && err.code === "P2002") return next(new AppError(409, "Exchange already exists"))

    next(new AppError(500, msg))
  }
}


export async function createMultiExchangesHandler(
  req: Request<{}, {}, CreateMultiExchangesInput>,
  res: Response,
  next: NextFunction
) {
  try {
    const data = req.body
    await db.exchange.createMany({
      data,
      skipDuplicates: true
    })

    res.status(200).json(HttpResponse(200, "Success"))
  } catch (err: any) {
    const msg = err?.message || "internal server error"
    logging.error(msg)

    if (err instanceof PrismaClientKnownRequestError && err.code === "P2002") return next(new AppError(409, "Exchange already exists"))

    next(new AppError(500, msg))
  }
}


export async function deleteExchangeHandler(
  req: Request<GetExchangeInput["params"]>,
  res: Response,
  next: NextFunction
) {
  try {
    const { exchangeId } = req.params
    await db.exchange.delete({
      where: {
        id: exchangeId
      }
    })

    res.status(200).json(HttpResponse(200, "Success deleted"))
  } catch (err: any) {
    const msg = err?.message || "internal server error"
    logging.error(msg)
    next(new AppError(500, msg))
  }
}

