import Result, { Err, Ok } from "@/libs/result"
import AppError, { AppErrorKind } from "@/libs/exceptions"

import { CacheResource } from "@/context/cacheKey"
import { BrandApiService } from "@/services/brandsApi"
import { useMutation } from "@tanstack/react-query"
import { useStore } from ".."
import { playSoundEffect } from "@/libs/playSound"
import { queryClient } from "@/components"


const apiService = BrandApiService.new()


export function useCreateMultiBrands() {
  const { dispatch } = useStore()

  const mutation = useMutation({
    mutationFn: (buf: ArrayBuffer) => apiService.uploadExcel(buf),
    onError(err: any) {
      dispatch({
        type: "OPEN_TOAST", payload: {
          message: `failed: ${err?.response?.data?.message || err?.message || "Unknown error"}`,
          severity: "error"
        }
      })
      dispatch({ type: "CLOSE_BACKDROP" })
      playSoundEffect("error")
    },
    onSuccess() {
      dispatch({
        type: "OPEN_TOAST", payload: {
          message: "Success created new brands.",
          severity: "success"
        }
      })
      dispatch({ type: "CLOSE_ALL_MODAL_FORM" })
      queryClient.invalidateQueries({
        queryKey: [CacheResource.Brand]
      })
      dispatch({ type: "CLOSE_BACKDROP" })
      playSoundEffect("success")
    }
  })

  const try_data: Result<typeof mutation.data, AppError> = !!mutation.error && mutation.isError
    ? Err(AppError.new((mutation.error as any).kind || AppErrorKind.ApiError, mutation.error.message))
    : Ok(mutation.data)

  return { ...mutation, try_data }
}

