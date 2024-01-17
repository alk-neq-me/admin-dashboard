import { CreateOrderInput } from "@/components/content/orders/forms";
import { DatePickerField } from "@/components/input-fields";
import { FormControl, Grid, TextField } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";


export function PickupAddressForm() {
  const { control } = useFormContext<CreateOrderInput>()


  return <Grid container gap={1}>
    <Grid item xs={5.9}>
      <Controller
        control={control}
        name="pickupAddress.username"
        render={({ field, fieldState }) => <FormControl fullWidth {...field}>
          <TextField
            defaultValue={field.value}
            label="Username" 
            error={!!fieldState.error} 
            helperText={!!fieldState.error ? fieldState.error.message : ""} 
          />
        </FormControl>}
      />
    </Grid>
    <Grid item xs={5.9}>
      <Controller
        control={control}
        name="pickupAddress.phone"
        render={({ field, fieldState }) => <FormControl fullWidth {...field}>
          <TextField
            defaultValue={field.value}
            label="Phone" 
            error={!!fieldState.error} 
            helperText={!!fieldState.error ? fieldState.error.message : ""} 
          />
        </FormControl>}
      />
    </Grid>
    <Grid item xs={5.9}>
      <Controller
        control={control}
        name="pickupAddress.email"
        render={({ field, fieldState }) => <FormControl fullWidth {...field}>
          <TextField
            defaultValue={field.value}
            label="Email" 
            error={!!fieldState.error} 
            helperText={!!fieldState.error ? fieldState.error.message : ""} 
          />
        </FormControl>}
      />
    </Grid>
    <Grid item xs={5.9}>
      <DatePickerField fieldName="pickupAddress.date" required />
    </Grid>
  </Grid>
}