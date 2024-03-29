import { OperationAction, Resource } from "@prisma/client";
import { db } from "../../utils/db";
import { AppService } from "../type";

const repository = db.auditLog;
/**
 * AuditLogService class provides methods for managing audit log data.
 *
 * @remarks
 * This class implements the AppService interface and is designed to handle operations related to audit logs.
 */
export class AuditLogService extends AppService<
  typeof repository.count,
  typeof repository.create,
  typeof repository.findMany,
  typeof repository.findUnique,
  typeof repository.findFirst,
  typeof repository.update,
  typeof repository.delete,
  typeof repository.deleteMany,
  typeof repository.upsert,
  typeof repository
> {
  constructor() {
    super(Resource.AuditLog, {
      action: OperationAction.Read,
      resourceIds: [],
    }, db.auditLog);
    this.name = "AuditLog";
  }

  /**
   * Creates a new instance of AuditLogService.
   * @returns A new instance of AuditLogService.
   */
  static new() {
    return new AuditLogService();
  }
}
