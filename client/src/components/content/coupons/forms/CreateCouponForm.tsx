import { Box, Grid, TextField } from "@mui/material";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { any, boolean, number, object, string, z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useStore } from "@/hooks";
import { useNavigate } from "react-router-dom";
import { queryClient } from "@/components";
import { MuiButton } from "@/components/ui";
import { DatePickerField, ProductInputField } from "@/components/input-fields";
import { createCouponFn } from "@/services/couponsApi";


const createCouponSchema = object({
  points: number({ required_error: "Points is required" })
    .min(0)
    .max(1_000),
  dolla: number({ required_error: "Dolla is required" })
    .min(0)
    .max(10),
  productId: string().optional(),
  isUsed: boolean().default(false),
  expiredDate: any()
}) 

export type CreateCouponInput = z.infer<typeof createCouponSchema>

export function CreateCouponForm() {
  const { state: {modalForm}, dispatch } = useStore()

  const navigate = useNavigate()
  const from = "/coupons"

  const {
    mutate: createCoupon,
  } = useMutation({
    mutationFn: createCouponFn,
    onSuccess: () => {
      dispatch({ type: "OPEN_TOAST", payload: {
        message: "Success created a new coupon.",
        severity: "success"
      } })
      if (modalForm.field === "*") navigate(from)
      dispatch({ type: "CLOSE_ALL_MODAL_FORM" })
      queryClient.invalidateQueries({
        queryKey: ["coupons"]
      })
    },
    onError: (err: any) => {
      dispatch({ type: "OPEN_TOAST", payload: {
        message: `failed: ${err.response.data.message}`,
        severity: "error"
      } })
    },
  })

  const methods = useForm<CreateCouponInput>({
    resolver: zodResolver(createCouponSchema)
  })

  const { handleSubmit, register, formState: { errors } } = methods

  const onSubmit: SubmitHandler<CreateCouponInput> = (value) => {
    createCoupon({ ...value, expiredDate: value.expiredDate?.toISOString() })
  }

  return (
    <FormProvider {...methods}>
      <Grid container spacing={1} component="form" onSubmit={handleSubmit(onSubmit)}>
        <Grid item xs={12} md={6}>
          <Box sx={{ '& .MuiTextField-root': { my: 1, width: '100%' } }}>
            <TextField 
              {...register("points", {
                valueAsNumber: true
              })} 
              type="number"
              label="Points" 
              error={!!errors.points} 
              helperText={!!errors.points ? errors.points.message : ""} 
              fullWidth
            />
            <TextField 
              fullWidth 
              {...register("dolla", {
                valueAsNumber: true
              })} 
              type="number"
              inputProps={{
                step: "0.01"
              }}
              label="Dolla" 
              error={!!errors.dolla} 
              helperText={!!errors.dolla ? errors.dolla.message : ""} 
            />
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box sx={{ '& .MuiTextField-root': { my: 1, width: '100%' } }}>
            <ProductInputField />
            <DatePickerField required fieldName="expiredDate" />
          </Box>
        </Grid>

        <Grid item xs={12}>
          <MuiButton variant="contained" type="submit">Create</MuiButton>
        </Grid>
      </Grid>
    </FormProvider>
  )
}

