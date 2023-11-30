import { Card } from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useStore } from "@/hooks";
import { SuspenseLoader, queryClient } from "@/components";
import { createMultiProductsFn, deleteMultiProductsFn, deleteProductFn, getProductsFn } from "@/services/productsApi";
import { ProductsListTable } from ".";
import { CreateProductInput } from "./forms";

export function ProductsList() {
  const { state: {productFilter}, dispatch } = useStore()

  const { data, isError, isLoading, error } = useQuery({
    queryKey: ["products", { filter: productFilter } ],
    queryFn: args => getProductsFn(args, { 
      filter: productFilter?.fields,
      pagination: {
        page: productFilter?.page || 1,
        pageSize: productFilter?.limit || 10
      },
      include: productFilter?.include
    }),
    select: data => data
  })

  const {
    mutate: createProducts
  } = useMutation({
    mutationFn: createMultiProductsFn,
    onError(err: any) {
      dispatch({ type: "OPEN_TOAST", payload: {
        message: `failed: ${err.response.data.message}`,
        severity: "error"
      } })
    },
    onSuccess() {
      dispatch({ type: "OPEN_TOAST", payload: {
        message: "Success created new products.",
        severity: "success"
      } })
      dispatch({ type: "CLOSE_ALL_MODAL_FORM" })
      queryClient.invalidateQueries({
        queryKey: ["products"]
      })
    }
  })

  const {
    mutate: deleteProduct
  } = useMutation({
    mutationFn: deleteProductFn,
    onError(err: any) {
      dispatch({ type: "OPEN_TOAST", payload: {
        message: `failed: ${err.response.data.message}`,
        severity: "error"
      } })
    },
    onSuccess() {
      dispatch({ type: "OPEN_TOAST", payload: {
        message: "Success delete a product.",
        severity: "success"
      } })
      dispatch({ type: "CLOSE_ALL_MODAL_FORM" })
      queryClient.invalidateQueries({
        queryKey: ["products"]
      })
    }
  })

  const {
    mutate: deleteProducts
  } = useMutation({
    mutationFn: deleteMultiProductsFn,
    onError(err: any) {
      dispatch({ type: "OPEN_TOAST", payload: {
        message: `failed: ${err.response.data.message}`,
        severity: "error"
      } })
    },
    onSuccess() {
      dispatch({ type: "OPEN_TOAST", payload: {
        message: "Success delete products.",
        severity: "success"
      } })
      dispatch({ type: "CLOSE_ALL_MODAL_FORM" })
      queryClient.invalidateQueries({
        queryKey: ["products"]
      })
    }
  })

  if (!data && isError || error) return <h1>ERROR: {JSON.stringify(error)}</h1>

  if (!data || isLoading) return <SuspenseLoader />

  function handleCreateManyProducts(data: CreateProductInput[]) {
    createProducts(data)
  }

  function handleDeleteProduct(id: string) {
    deleteProduct(id)
  }

  function handleDeleteMultiProducts(ids: string[]) {
    deleteProducts(ids)
  }

  return <Card>
    <ProductsListTable
      products={data.results} 
      count={data.count} 
      onCreateManyProducts={handleCreateManyProducts} 
      onDelete={handleDeleteProduct}
      onMultiDelete={handleDeleteMultiProducts}
    />
  </Card>
}
