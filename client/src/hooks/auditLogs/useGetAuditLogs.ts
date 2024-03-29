import AppError, { AppErrorKind } from "@/libs/exceptions";
import Result, { Err, Ok } from "@/libs/result";

import { AuditLogWhereInput } from "@/context/auditLogs";
import { CacheKey, CacheResource } from "@/context/cacheKey";
import { AuditLogApiService } from "@/services/auditLogsApi";
import { Pagination } from "@/services/types";
import { useQuery } from "@tanstack/react-query";

const apiService = AuditLogApiService.new();

export function useGetAuditLogs({
  filter,
  pagination,
  include,
}: {
  filter?: AuditLogWhereInput["where"];
  include?: AuditLogWhereInput["include"];
  pagination: Pagination;
}) {
  const query = useQuery({
    queryKey: [CacheResource.AuditLog, {
      filter,
      pagination,
      include,
    }] as CacheKey<
      "audit-logs"
    >["list"],
    queryFn: args =>
      apiService.findMany(args, {
        filter,
        pagination,
        include,
      }),
    select: data => data,
  });

  const try_data: Result<typeof query.data, AppError> =
    !!query.error && query.isError
      ? Err(
        AppError.new(
          (query.error as any).kind || AppErrorKind.ApiError,
          query.error.message,
        ),
      )
      : Ok(query.data);

  return {
    ...query,
    try_data,
  };
}
