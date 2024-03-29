import AppError, { AppErrorKind } from "@/libs/exceptions";
import Result, { Err, Ok } from "@/libs/result";

import { queryClient } from "@/components";
import { CacheResource } from "@/context/cacheKey";
import { playSoundEffect } from "@/libs/playSound";
import { RoleApiService } from "@/services/rolesApi";
import { useMutation } from "@tanstack/react-query";
import { useStore } from "..";

const apiService = RoleApiService.new();

export function useCreateMultiRoles() {
  const { dispatch } = useStore();

  const mutation = useMutation({
    mutationFn: (...args: Parameters<typeof apiService.uploadExcel>) =>
      apiService.uploadExcel(...args),
    onError(err: any) {
      dispatch({
        type: "OPEN_TOAST",
        payload: {
          message: `failed: ${
            err?.response?.data?.message || err?.message || "Unknown error"
          }`,
          severity: "error",
        },
      });
      dispatch({ type: "CLOSE_BACKDROP" });
      playSoundEffect("error");
    },
    onSuccess() {
      dispatch({
        type: "OPEN_TOAST",
        payload: {
          message: "Success created new roles.",
          severity: "success",
        },
      });
      dispatch({ type: "CLOSE_ALL_MODAL_FORM" });
      queryClient.invalidateQueries({
        queryKey: [CacheResource.Role],
      });
      dispatch({ type: "CLOSE_BACKDROP" });
      playSoundEffect("success");
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
