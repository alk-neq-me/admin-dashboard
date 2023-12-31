import { Box, FormControlLabel, Grid, InputAdornment, MenuItem, OutlinedInput, Switch, TextField } from "@mui/material";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { BrandInputField, CatgoryMultiInputField, EditorInputField, SpecificationInputField } from "@/components/input-fields";
import { SuspenseLoader, queryClient } from "@/components";
import { MuiButton } from "@/components/ui";
import { FormModal } from "@/components/forms";
import { CreateBrandForm } from "../../brands/forms";
import { CreateCategoryForm } from "../../categories/forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { boolean, number, object, string, z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getProductFn, updateProductFn } from "@/services/productsApi";
import { useStore } from "@/hooks";
import { useNavigate, useParams } from "react-router-dom";
import { getExchangesFn } from "@/services/exchangesApi";
import { useEffect } from "react";
import { priceUnit, productStatus, productStockStatus } from ".";


const updateProductSchema = object({
  price: number({ required_error: "Price is required "}),
  brandId: string({ required_error: "Brand is required" })
    .min(2).max(128),
  title: string({ required_error: "Brand is required" })
    .min(2).max(128),
  specification: object({
    name: string({ required_error: "Specification name is required" }),
    value: string({ required_error: "Specification value is required" }),
  }).array(),
  overview: string().max(5000).optional(),
  description: string().max(5000).optional(),
  categories: string().array().default([]),
  salesCategory: object({}).array().default([]),
  discount: number().max(100).default(0),
  instockStatus: z.enum(productStockStatus).default("AskForStock"),
  dealerPrice: number().min(0),
  marketPrice: number().min(0),
  priceUnit: z.enum(priceUnit).default("MMK"),
  quantity: number().min(0),
  isPending: boolean().default(false),
  status: z.enum(productStatus).default("Draft"),

  itemCode: string().nullable().optional(),
})

export type UpdateProductInput = z.infer<typeof updateProductSchema>

const toUpdateFields: (keyof UpdateProductInput)[] = [
  "title", "priceUnit", 
  "price", "discount",
  "specification", "overview", 
  "categories", "marketPrice", 
  "instockStatus", 
  "description",
  "quantity",
  "dealerPrice",
  "isPending"
]


export function UpdateProductForm() {
  const { state: {modalForm}, dispatch } = useStore()

  const navigate = useNavigate()
  const { productId } = useParams()
  const from = "/products"

  const { 
    data: product,
    isLoading: isLoadingProduct,
    isError: isErrorProduct,
    error: errorProduct,
    isSuccess: isSuccessFetchProduct,
    fetchStatus: fetchStatusProduct
  } = useQuery({
    enabled: !!productId,
    queryKey: ["products", { id: productId }],
    queryFn: args => getProductFn(args, { productId }),
    select: data => data?.product
  })

  const {
    mutate: updateProduct
  } = useMutation({
    mutationFn: updateProductFn,
    onSuccess: () => {
      dispatch({ type: "OPEN_TOAST", payload: {
        message: "Success updated a new product.",
        severity: "success"
      } })
      if (modalForm.field === "*") navigate(from)
      dispatch({ type: "CLOSE_ALL_MODAL_FORM" })
      queryClient.invalidateQueries({
        queryKey: ["products"]
      })
    },
    onError: () => {
      dispatch({ type: "OPEN_TOAST", payload: {
        message: "failed created a new product.",
        severity: "error"
      } })
    }
  })

  const methods = useForm<UpdateProductInput>({
    resolver: zodResolver(updateProductSchema),
  })

  const { data: exchangeRate } = useQuery({
    queryKey: ["exchanges", "latest", methods.getValues("priceUnit")],
    queryFn: args => getExchangesFn(args, {
      filter: {
        from: methods.getValues("priceUnit"),
        to: "MMK",
      },
      pagination: {
        page: 1,
        pageSize: 1
      }
    }),
    select: data => data.results
  })

  useEffect(() => {
    queryClient.invalidateQueries({
      queryKey: ["exchanges", "latest", methods.getValues("priceUnit")],
    })
  }, [methods.watch("priceUnit")])

  useEffect(() => {
    if (isSuccessFetchProduct && product && fetchStatusProduct === "idle") {
      toUpdateFields.forEach(key => {
        const value = key === "isPending" 
          ? product.status === "Pending"
          : key ==="categories"
          ? product[key]?.map(({category: {id}}) => id)
          : product[key]

        methods.setValue(key, value)
      })
      if (product.brandId) methods.setValue("brandId", product.brandId)
    }
  }, [isSuccessFetchProduct, fetchStatusProduct])


  const handleOnCloseModalForm = () => {
    dispatch({ type: "CLOSE_MODAL_FORM", payload: "*" })
  }

  const { handleSubmit, register, formState: { errors } } = methods

  const onSubmit: SubmitHandler<UpdateProductInput> = (value) => {
    if (productId) updateProduct({id: productId, product: {
      ...value,
      status: product?.status
    }})
  }

  const handleOnCalculate = (_: React.MouseEvent<HTMLButtonElement>) => {
    const price = methods.getValues("price")
    const rate = exchangeRate?.[0]?.rate || 1
    methods.setValue("price", price * rate)
  }


  if (isErrorProduct && errorProduct) return <h1>{errorProduct.message}</h1>
  if (isLoadingProduct || !product) return <SuspenseLoader />

  return (
    <>
      <FormProvider {...methods}>
        <Grid container spacing={1} component="form" onSubmit={handleSubmit(onSubmit)}>
          <Grid item md={6} xs={12}>
            <Box sx={{ '& .MuiTextField-root': { my: 1, width: '100%' } }}>
              <TextField fullWidth {...register("title")} label="Title" error={!!errors.title} helperText={!!errors.title ? errors.title.message : ""} />
              <OutlinedInput 
                fullWidth 
                {...register("price", { valueAsNumber: true })} 
                type="number" 
                placeholder="Price" 
                error={!!errors.price} 
                inputProps={{
                  step: "0.01"
                }}
                // helperText={!!errors.price 
                //   ? errors.price.message 
                //   : "1 dolla ~ 2098.91 kyat"
                // } 
                sx={{
                  my: 1
                }}
                endAdornment={
                  <InputAdornment position="end">
                    <MuiButton onClick={handleOnCalculate} variant="outlined" size="small">
                      Calculate
                    </MuiButton>
                  </InputAdornment>
                }
              />
            </Box>
          </Grid>


          <Grid item md={6} xs={12}>
            <Box sx={{ '& .MuiTextField-root': { my: 1, width: '100%' } }}>
              <TextField 
                {...register("priceUnit")} 
                defaultValue={priceUnit[0]}
                name="priceUnit"
                label="Price unit" 
                select
                error={!!errors.priceUnit} 
                helperText={!!errors.priceUnit ? errors.priceUnit.message : ""} 
                fullWidth
              >
                {priceUnit.map(t => (
                  <MenuItem key={t} value={t}>
                    {t}
                  </MenuItem>
                ))}
              </TextField>
              <TextField fullWidth {...register("dealerPrice", { valueAsNumber: true })} type="number" label="Dealer Price" error={!!errors.dealerPrice} helperText={!!errors.dealerPrice ? errors.dealerPrice.message : ""} />
            </Box>
          </Grid>

          <Grid item md={6} xs={12}>
            <Box sx={{ '& .MuiTextField-root': { my: 1, width: '100%' } }}>
              <TextField fullWidth {...register("marketPrice", { valueAsNumber: true })} type="number" label="MarketPrice" error={!!errors.marketPrice} helperText={!!errors.marketPrice ? errors.marketPrice.message : ""} />
            </Box>
          </Grid>

          <Grid item md={6} xs={12}>
            <Box sx={{ '& .MuiTextField-root': { my: 1, width: '100%' } }}>
              <CatgoryMultiInputField updateField />
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ '& .MuiTextField-root': { my: 1, width: '100%' } }}>
              <EditorInputField fieldName="overview" />
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ '& .MuiTextField-root': { my: 1, width: '100%' } }}>
              <EditorInputField fieldName="description" />
            </Box>
          </Grid>

          <Grid item md={6} xs={12}>
            <Box sx={{ '& .MuiTextField-root': { my: 1, width: '100%' } }}>
              <TextField 
                fullWidth 
                {...register("instockStatus")} 
                defaultValue={productStockStatus[2]}
                select
                label="Instock Status" 
                error={!!errors.instockStatus} 
                helperText={!!errors.instockStatus ? errors.instockStatus.message : ""} 
              >
                {productStockStatus.map(status => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </TextField>
              <BrandInputField updateField />
              <TextField fullWidth type="number" {...register("quantity", { valueAsNumber: true })} label="Quantity" error={!!errors.quantity} helperText={!!errors.quantity ? errors.quantity.message : ""} />
              <TextField 
                fullWidth 
                type="number" 
                {...register("discount", { valueAsNumber: true })} 
                inputProps={{
                  step: "0.01"
                }}
                label="Discount" error={!!errors.discount} helperText={!!errors.discount ? errors.discount.message : ""} />
            </Box>
          </Grid>

          <Grid item md={6} xs={12}>
            <Box sx={{ '& .MuiTextField-root': { my: 1, width: '100%' } }}>
              {/* Image upload */}
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ '& .MuiTextField-root': { my: 1, width: '100%' } }}>
              <SpecificationInputField />
            </Box>
          </Grid>

          <Grid item xs={12}>
            <FormControlLabel
              label="Request review"
              control={<Switch 
                {...register("isPending")}
              />}
            />
          </Grid>

          <Grid item xs={12}>
            <MuiButton variant="contained" type="submit">Create</MuiButton>
          </Grid>
        </Grid>
      </FormProvider>

      
      {modalForm.field === "brands"
      ? <FormModal field='brands' title='Create new brand' onClose={handleOnCloseModalForm}>
        <CreateBrandForm />
      </FormModal>
      : null}

      {modalForm.field === "categories"
      ? <FormModal field='categories' title='Create new category' onClose={handleOnCloseModalForm}>
        <CreateCategoryForm />
      </FormModal>
      : null}
    </>
  )
}

