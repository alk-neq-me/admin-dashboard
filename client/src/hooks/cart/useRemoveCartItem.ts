import { queryClient } from "@/components";
import { CacheResource } from "@/context/cacheKey";
import { playSoundEffect } from "@/libs/playSound";
import { CartApiService } from "@/services/cartApi";
import { useMutation } from "@tanstack/react-query";
import { useStore } from "..";

import AppError, { AppErrorKind } from "@/libs/exceptions";
import Result, { Err, Ok } from "@/libs/result";

const apiService = CartApiService.new();

export function useRemoveCartItem() {
  const { dispatch } = useStore();

  const mutation = useMutation({
    mutationFn: (
      ...args: Parameters<typeof apiService.deleteSingleItem>
    ) => apiService.deleteSingleItem(...args),
    onSuccess: () => {
      dispatch({ type: "OPEN_MODAL_FORM", payload: "cart" });
      queryClient.invalidateQueries({
        queryKey: [CacheResource.Cart],
      });
    },
    onError: (err: any) => {
      dispatch({
        type: "OPEN_TOAST",
        payload: {
          message: `failed: ${
            err?.response?.data?.message || err?.message || "Unknown error"
          }`,
          severity: "error",
        },
      });
      playSoundEffect("error");
    },
  });

  const try_data: Result<typeof mutation.data, AppError> =
    !!mutation.error && mutation.isError
      ? Err(
        AppError.new(
          (mutation.error as any).kind || AppErrorKind.ApiError,
          mutation.error.message,
        ),
      )
      : Ok(mutation.data);

  return { ...mutation, try_data };
}
