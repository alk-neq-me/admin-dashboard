import { BrandFilter } from "@/context/brand";
import AppError, { AppErrorKind } from "@/libs/exceptions";
import Result, { Err, Ok } from "@/libs/result";

import { getBrandFn } from "@/services/brandsApi";
import { useQuery } from "@tanstack/react-query";


export function useGetBrand({
  id,
  include,
}: {
  id: string | undefined,
  include?: BrandFilter["include"],
  }) {
  const query = useQuery({
    enabled: !!id,
    queryKey: ["brands", { id }],
    queryFn: args => getBrandFn(args, { brandId: id, include }),
    select: data => data?.brand
  })


  const try_data: Result<typeof query.data, AppError> = !!query.error && query.isError
    ? Err(AppError.new(AppErrorKind.ApiError, query.error.message)) 
    : Ok(query.data)


  return {
    ...query,
    try_data
  }
}
