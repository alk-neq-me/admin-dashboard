import Result, { Err, Ok } from "@/libs/result"
import AppError, { AppErrorKind } from "@/libs/exceptions"

import { useMutation } from "@tanstack/react-query"
import { useStore } from ".."
import { playSoundEffect } from "@/libs/playSound"
import { queryClient } from "@/components"
import { deleteMultiOrdersFn } from "@/services/orderApi"


export function useDeleteMultiOrders() {
  const { dispatch } = useStore()

  const mutation = useMutation({
    mutationFn: deleteMultiOrdersFn,
    onError(err: any) {
      dispatch({ type: "OPEN_TOAST", payload: {
        message: `failed: ${err.response.data.message}`,
        severity: "error"
      } })
      playSoundEffect("error")
    },
    onSuccess() {
      dispatch({ type: "OPEN_TOAST", payload: {
        message: "Success delete multi orders.",
        severity: "success"
      } })
      dispatch({ type: "CLOSE_ALL_MODAL_FORM" })
      queryClient.invalidateQueries({
        queryKey: ["orders"]
      })
      playSoundEffect("success")
    }
  })

  const try_data: Result<typeof mutation.data, AppError> = !!mutation.error && mutation.isError
    ? Err(AppError.new(AppErrorKind.ApiError, mutation.error.message)) 
    : Ok(mutation.data)

  return {
    ...mutation,
    try_data
  }
}

