import { NextFunction, Request, Response } from "express";
import logging from "../middleware/logging/logging";
import AppError from "../utils/appError";
import { HttpDataResponse, HttpListResponse } from "../utils/helper";
import { convertNumericStrings } from "../utils/convertNumber";
import { ChangeUserRoleInput, GetUserByUsernameInput, GetUserInput, UploadImageUserInput, UserFilterPagination } from "../schemas/user.schema";
import { db } from "../utils/db";

export async function getMeProfileHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userSession = req.user

    if (!userSession) return next(new AppError(400, "Session has expired or user doesn't exist"))

    const user = await db.user.findUnique({
      where: {
        id: userSession.id
      },
      include: {
        order: true,
        favorites: true,
        addresses: true,
        reviews: true,
        _count: true
      },
    })

    res.status(200).json(HttpDataResponse({ user }))
  } catch (err: any) {
    const msg = err?.message || "internal server error"
    logging.error(msg)
    next(new AppError(500, msg))
  }
}

export async function getMeHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = req.user

    res.status(200).json(HttpDataResponse({ user }))
  } catch (err: any) {
    const msg = err?.message || "internal server error"
    logging.error(msg)
    next(new AppError(500, msg))
  }
}


export async function getUserHandler(
  req: Request<GetUserInput>,
  res: Response,
  next: NextFunction
) {
  try {
    const { userId } = req.params

    const user = await db.user.findUnique({
      where: {
        id: userId
      }
    })

    res.status(200).json(HttpDataResponse({ user }))
  } catch (err: any) {
    const msg = err?.message || "internal server error"
    logging.error(msg)
    next(new AppError(500, msg))
  }
}


export async function getUserByUsernameHandler(
  req: Request<GetUserByUsernameInput>,
  res: Response,
  next: NextFunction
) {
  try {
    const { username } = req.params

    const user = await db.user.findUnique({
      where: {
        username
      }
    })

    res.status(200).json(HttpDataResponse({ user }))
  } catch (err: any) {
    const msg = err?.message || "internal server error"
    logging.error(msg)
    next(new AppError(500, msg))
  }
}


export async function getUsersHandler(
  req: Request<{}, {}, {}, UserFilterPagination>,
  res: Response,
  next: NextFunction
) {
  try {
    const { filter = {}, pagination } = convertNumericStrings(req.query)
    const { id, name, email } = filter
    const { page, pageSize } = pagination ??  // ?? nullish coalescing operator, check only `null` or `undefied`
      { page: 1, pageSize: 10 }

    const offset = (page - 1) * pageSize

    const users = await db.user.findMany({
      where: {
        id,
        name,
        email,
      },
      skip: offset,
      take: pageSize
    })
    res.status(200).json(HttpListResponse(users))
  } catch (err) {
    next(err)
  }
}


// must use after, onlyAdmin middleware
export async function changeUserRoleHandler(
  req: Request<GetUserInput, {}, ChangeUserRoleInput>,
  res: Response,
  next: NextFunction
) {
  const { userId } = req.params
  const { role } = req.body

  try {
    const userExist = await db.user.findUnique({ where: {
      id: userId
    }});

    if (!userExist) return next(new AppError(404, "User not found"))

    const updatedUser = await db.user.update({ 
      where: {
        id: userExist.id
      },
      data: {
        role
      }
    })

    res.status(200).json(HttpDataResponse({ user: updatedUser }))
  } catch (err) {
    next(err)
  }
}


export async function uploadImageCoverHandler(
  req: Request<{}, {}, UploadImageUserInput>,
  res: Response,
  next: NextFunction
) {
  try {
    // @ts-ignore  for mocha testing
    const user = req.user

    if (!user) return next(new AppError(400, "Session has expired or user doesn't exist"))

    const { image } = req.body

    const updatedUser = await db.user.update({
      where: {
        id: user.id
      },
      data: {
        coverImage: image
      }
    })

    res.status(200).json(HttpDataResponse({ user: updatedUser }))
  } catch (err) {
    next(err)
  }
}


export async function uploadImageProfileHandler(
  req: Request<{}, {}, UploadImageUserInput>,
  res: Response,
  next: NextFunction
) {
  try {
    // @ts-ignore  for mocha testing
    const user = req.user

    if (!user) return next(new AppError(400, "Session has expired or user doesn't exist"))

    const { image } = req.body

    const updatedUser = await db.user.update({
      where: {
        id: user.id
      },
      data: {
        image
      }
    })

    res.status(200).json(HttpDataResponse({ user: updatedUser }))
  } catch (err) {
    next(err)
  }
}
