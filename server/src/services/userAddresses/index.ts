import Result, { Err, Ok, as_result_async } from "../../utils/result";
import AppError, { StatusCode } from "../../utils/appError";

import { AppService, Auditable, Pagination } from "../type";
import { AuditLog, AuditLogAction, User } from "@prisma/client";
import { db } from "../../utils/db";
import { convertPrismaErrorToAppError } from "../../utils/convertPrismaErrorToAppError";


/**
 * UserAddressService class provides methods for managing user address data.
 *
 * @remarks
 * This class implements the AppService interface and is designed to handle operations related to user address.
 */
export class UserAddressService implements AppService, Auditable {
  private repository = db.userAddress
  public log?: { action: AuditLogAction; resourceIds: string[] }

  /**
   * Creates a new instance of UserAddressService.
   * @returns A new instance of UserAddressService.
   */
  static new() { return new UserAddressService() }


  async tryCount(): Promise<Result<number, AppError>> {
    const opt = as_result_async(this.repository.count)

    const result = (await opt()).map_err(convertPrismaErrorToAppError)

    this.log = {
      action: AuditLogAction.Read,
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
      action: AuditLogAction.Read,
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
    if (_res) this.log = {
      action: AuditLogAction.Read,
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
    if (_res) this.log = {
      action: AuditLogAction.Read,
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
      action: AuditLogAction.Create,
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
      action: AuditLogAction.Update,
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
      action: AuditLogAction.Delete,
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
      action: AuditLogAction.Delete,
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


  async audit(_user: User): Promise<Result<AuditLog, AppError>> {
    console.log({ log: this.log })
    return Err(AppError.new(StatusCode.ServiceUnavailable, `This feature is not implemented yet.`))
  }
}

