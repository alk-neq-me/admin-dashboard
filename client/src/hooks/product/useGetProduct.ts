import AppError, { AppErrorKind } from "@/libs/exceptions";
import Result, { Err, Ok } from "@/libs/result";

import { getProductFn } from "@/services/productsApi";
import { useQuery } from "@tanstack/react-query";


export function useGetProduct({
  id,
  include,
}: {
  id: string | undefined,
  include?: any,  // TODO: type fix
  }) {
  const query = useQuery({
    enabled: !!id,
    queryKey: ["products", { id }],
    queryFn: args => getProductFn(args, { productId: id, include }),
    select: data => data?.product
  })


  const try_data: Result<typeof query.data, AppError> = !!query.error && query.isError
    ? Err(AppError.new(AppErrorKind.ApiError, query.error.message)) 
    : Ok(query.data)


  return {
    ...query,
    try_data
  }
}