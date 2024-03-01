import Result, { Err, Ok, as_result_async } from "../../utils/result";
import AppError, { StatusCode } from "../../utils/appError";

import { AppService, MetaAppService, Pagination } from "../type";
import { OperationAction, Resource } from "@prisma/client";
import { db } from "../../utils/db";
import { convertPrismaErrorToAppError } from "../../utils/convertPrismaErrorToAppError";


/**
 * OrderService class provides methods for managing order data.
 *
 * @remarks
 * This class implements the AppService interface and is designed to handle operations related to items of order.
 */
export class OrderItemService extends MetaAppService implements AppService {
  private repository = db.orderItem

  constructor() {
    super(Resource.OrderItem, { action: OperationAction.Read, resourceIds: [] })
  }

  /**
   * Creates a new instance of OrderItemService.
   * @returns A new instance of OrderItemService.
   */
  static new() { return new OrderItemService() }


  async tryCount(): Promise<Result<number, AppError>> {
    const opt = as_result_async(this.repository.count)

    const result = (await opt()).map_err(convertPrismaErrorToAppError)

    this.log = {
      action: OperationAction.Read,
      resourceIds: []
    }
    return result
  }


  async tryFindManyWithCount(...args: [{ pagination: Pagination; }, ...Parameters<typeof this.repository.findMany>]): Promise<
    Result<[number, Awaited<ReturnType<typeof this.repository.findMany>>], AppError>
  > {
    const [{pagination}, arg] = args
    const { page = 1, pageSize = 10 } = pagination
    const offset = (page - 1) * pageSize

    const opt = as_result_async(this.repository.findMany)

    const count = await this.tryCount()
    if (count.is_err()) return Err(count.unwrap_err())

    const result = (await opt({ ...arg, skip: offset, take: pageSize })).map_err(convertPrismaErrorToAppError)
    if (result.is_err()) return Err(result.unwrap_err())

    this.log = {
      action: OperationAction.Read,
      resourceIds: result.ok_or_throw().map(x => x.id)
    }
    return Ok([count.ok_or_throw(), result.ok_or_throw()])
  }


  async tryFindUnique(...args: Parameters<typeof this.repository.findUnique>): Promise<
    Result<Awaited<ReturnType<typeof this.repository.findUnique>>, AppError>
  > {
    const [arg] = args

    const opt = as_result_async(this.repository.findUnique)

    const result = (await opt(arg)).map_err(convertPrismaErrorToAppError)

    const _res = result.ok()
    if (!_res) return Err(AppError.new(StatusCode.NotFound, `${this.resource} not found.`))

    if (_res) this.log = {
      action: OperationAction.Read,
      resourceIds: [_res.id]
    }
    return result
  }


  async tryFindFirst(...args: Parameters<typeof this.repository.findFirst>): Promise<
    Result<Awaited<ReturnType<typeof this.repository.findFirst>>, AppError>
  > {
    const [arg] = args

    const opt = as_result_async(this.repository.findFirst)

    const result = (await opt(arg)).map_err(convertPrismaErrorToAppError)

    const _res = result.ok()
    if (!_res) return Err(AppError.new(StatusCode.NotFound, `${this.resource} not found.`))

    if (_res) this.log = {
      action: OperationAction.Read,
      resourceIds: [_res.id]
    }
    return result
  }


  async tryCreate(...args: Parameters<typeof this.repository.create>): Promise<
    Result<Awaited<ReturnType<typeof this.repository.create>>, AppError>
  > {
    const [arg] = args

    const opt = as_result_async(this.repository.create)

    const result = (await opt(arg)).map_err(convertPrismaErrorToAppError)

    this.log = {
      action: OperationAction.Create,
      resourceIds: [result.ok_or_throw().id]
    }
    return result
  }


  async tryUpdate(...args: Parameters<typeof this.repository.update>): Promise<
    Result<Awaited<ReturnType<typeof this.repository.update>>, AppError>
  > {
    const [arg] = args

    const opt = as_result_async(this.repository.update)

    const result = (await opt(arg)).map_err(convertPrismaErrorToAppError)

    this.log = {
      action: OperationAction.Update,
      resourceIds: [result.ok_or_throw().id]
    }
    return result
  }


  async tryUpsert(...args: Parameters<typeof this.repository.upsert>): Promise<
    Result<Awaited<ReturnType<typeof this.repository.update>>, AppError>
  > {
    const [arg] = args

    const opt = as_result_async(this.repository.upsert)

    const result = (await opt(arg)).map_err(convertPrismaErrorToAppError)

    this.log = {
      action: OperationAction.Update,
      resourceIds: [result.ok_or_throw().id]
    }
    return result
  }


  async tryDelete(...args: Parameters<typeof this.repository.delete>): Promise<
    Result<Awaited<ReturnType<typeof this.repository.delete>>, AppError>
  > {
    const [arg] = args

    const opt = as_result_async(this.repository.delete)

    const result = (await opt(arg)).map_err(convertPrismaErrorToAppError)

    this.log = {
      action: OperationAction.Delete,
      resourceIds: [result.ok_or_throw().id]
    }
    return result
  }


  async tryDeleteMany(...args: Parameters<typeof this.repository.deleteMany>): Promise<
    Result<Awaited<ReturnType<typeof this.repository.deleteMany>>, AppError>
  > {
    const [arg] = args

    const opt = as_result_async(this.repository.deleteMany)

    const result = (await opt(arg)).map_err(convertPrismaErrorToAppError)

    const _res = (arg?.where?.id as any)?.in
    if (Array.isArray(_res) && _res.length) this.log = {
      action: OperationAction.Delete,
      resourceIds: _res
    }
    return result
  }


  // Data create by uploading excel 
  // Update not affected
  async tryExcelUpload(_file: Express.Multer.File): Promise<
    Result<Awaited<ReturnType<typeof this.repository.upsert>>[], AppError>
  > {
    return Err(AppError.new(StatusCode.ServiceUnavailable, `This feature is not implemented yet.`))
  }
}
