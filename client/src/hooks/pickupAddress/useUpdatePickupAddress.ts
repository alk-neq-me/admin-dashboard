import AppError, { AppErrorKind } from "@/libs/exceptions";
import Result, { Err, Ok } from "@/libs/result";

import { queryClient } from "@/components";
import { CacheResource } from "@/context/cacheKey";
import { playSoundEffect } from "@/libs/playSound";
import { PickupAddressApiService } from "@/services/pickupAddressApi";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useStore } from "..";

const apiService = PickupAddressApiService.new();

export function useUpdatePickupAddress() {
  const { state: { modalForm }, dispatch } = useStore();

  const navigate = useNavigate();
  const from = `/${CacheResource.PickupAddress}`;

  const mutation = useMutation({
    mutationFn: (...args: Parameters<typeof apiService.update>) =>
      apiService.update(...args),
    onSuccess: () => {
      dispatch({
        type: "OPEN_TOAST",
        payload: {
          message: "Success updated a pickup address.",
          severity: "success",
        },
      });
      if (modalForm.field === "*") navigate(from);
      dispatch({ type: "CLOSE_ALL_MODAL_FORM" });
      queryClient.invalidateQueries({
        queryKey: [CacheResource.PickupAddress],
      });
      playSoundEffect("success");
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

  return {
    ...mutation,
    try_data,
  };
}
