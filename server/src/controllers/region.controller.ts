import { db } from "../utils/db";
import { convertNumericStrings } from "../utils/convertNumber";
import { parseExcel } from "../utils/parseExcel";
import { convertStringToBoolean } from "../utils/convertStringToBoolean";
import { NextFunction, Request, Response } from "express";
import { HttpDataResponse, HttpListResponse, HttpResponse } from "../utils/helper";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import AppError from "../utils/appError";
import logging from "../middleware/logging/logging";
import fs from "fs"
import { CreateMultiRegionsInput, CreateRegionInput, DeleteMultiRegionsInput, GetRegionInput, RegionFilterPagination, UpdateRegionInput } from "../schemas/region.schema";


export async function getRegionsHandler(
  req: Request<{}, {}, {}, RegionFilterPagination>,
  res: Response,
  next: NextFunction
) {
  try {
    const { filter = {}, pagination, orderBy, include: includes } = convertNumericStrings(req.query)
    const include = convertStringToBoolean(includes) as RegionFilterPagination["include"]
    const {
      id,
      name,
    } = filter
    const { page, pageSize } = pagination ??  // ?? nullish coalescing operator, check only `null` or `undefied`
      { page: 1, pageSize: 10 }

    const offset = (page - 1) * pageSize

    const [count, regions] = await db.$transaction([
      db.region.count(),
      db.region.findMany({
        where: {
          id,
          name
        },
        include,
        orderBy,
        skip: offset,
        take: pageSize,
      })
    ])

    res.status(200).json(HttpListResponse(regions, count))
  } catch (err: any) {
    const msg = err?.message || "internal server error"
    logging.error(msg)
    next(new AppError(500, msg))
  }
}


export async function getRegionHandler(
  req: Request<GetRegionInput["params"] & Pick<RegionFilterPagination, "include">>,
  res: Response,
  next: NextFunction
) {
  try {
    const { regionId } = req.params

    const { include: includes } = convertNumericStrings(req.query)
    const include = convertStringToBoolean(includes) as RegionFilterPagination["include"]

    const region = await db.region.findUnique({
      where: {
        id: regionId
      },
      include
    })

    res.status(200).json(HttpDataResponse({ region }))
  } catch (err: any) {
    const msg = err?.message || "internal server error"
    logging.error(msg)
    next(new AppError(500, msg))
  }
}


export async function createMultiRegionsHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const excelFile = req.file

    if (!excelFile) return res.status(204)

    const buf = fs.readFileSync(excelFile.path)
    const data = parseExcel(buf) as CreateMultiRegionsInput

    // Update not affected
    await Promise.all(data.map(region => db.region.upsert({
      where: {
        name: region.name
      },
      create: {
        name: region.name,
      },
      update: {}
    })))

    res.status(201).json(HttpResponse(201, "Success"))
  } catch (err: any) {
    const msg = err?.message || "internal server error"
    logging.error(msg)

    if (err instanceof PrismaClientKnownRequestError && err.code === "P2002") return next(new AppError(409, "Region already exists"))

    next(new AppError(500, msg))
  }
}


export async function createRegionHandler(
  req: Request<{}, {}, CreateRegionInput>,
  res: Response,
  next: NextFunction
) {
  try {
    const { name, cities } = req.body

    const region = await db.region.create({
      data: {
        name,
        cities: {
          connect: cities.map(cityId => ({ id: cityId }))
        }
      },
    })

    res.status(201).json(HttpDataResponse({ region }))
  } catch (err: any) {
    const msg = err?.message || "internal server error"
    logging.error(msg)

    if (err instanceof PrismaClientKnownRequestError && err.code === "P2002") return next(new AppError(409, "Region already exists"))

    next(new AppError(500, msg))
  }
}


export async function deleteRegionHandler(
  req: Request<GetRegionInput["params"]>,
  res: Response,
  next: NextFunction
) {
  try {
    const { regionId } = req.params

    await db.region.delete({
      where: {
        id: regionId
      }
    })

    res.status(200).json(HttpResponse(200, "Success deleted"))
  } catch (err: any) {
    const msg = err?.message || "internal server error"
    logging.error(msg)
    next(new AppError(500, msg))
  }
}


export async function deleteMultilRegionsHandler(
  req: Request<{}, {}, DeleteMultiRegionsInput>,
  res: Response,
  next: NextFunction
) {
  try {
    const { regionIds } = req.body

    await db.region.deleteMany({
      where: {
        id: {
          in: regionIds
        }
      }
    })

    res.status(200).json(HttpResponse(200, "Success deleted"))
  } catch (err: any) {
    const msg = err?.message || "internal server error"
    logging.error(msg)
    next(new AppError(500, msg))
  }
}


export async function updateRegionHandler(
  req: Request<UpdateRegionInput["params"], {}, UpdateRegionInput["body"]>,
  res: Response,
  next: NextFunction
) {
  try {
    const { regionId } = req.params
    const data = req.body

    const [region] = await db.$transaction([
      db.region.update({
        where: { id: regionId },
        data: {
          cities: {
            set: data.cities.map(cityId => ({ id: cityId }))
          }
        }
      }),
    ])

    res.status(200).json(HttpDataResponse({ region }))
  } catch (err: any) {
    const msg = err?.message || "internal server error"
    logging.error(msg)
    next(new AppError(500, msg))
  }
}

