import { Card } from "@mui/material";
import { SuspenseLoader } from "@/components";
import { CategoriesListTable } from "@/components/content/categories";
import { useStore } from "@/hooks";
import { useCreateMultiCategories, useDeleteCategory, useDeleteMultiCategories, useGetCategories } from "@/hooks/category";


export function CategoriesList() {
  const { state: {categoryFilter} } = useStore()

  // Queries
  const categoriesQuery = useGetCategories({
    filter: categoryFilter?.fields,
    pagination: {
      page: categoryFilter?.page || 1,
      pageSize: categoryFilter?.limit || 10
    },
  })

  // Mutations
  const createCategoriesMutation = useCreateMultiCategories()
  const deleteCategoryMutation = useDeleteCategory()
  const deleteCategoriesMutation = useDeleteMultiCategories()

  // Extraction
  const data = categoriesQuery.try_data.ok_or_throw()


  if (!data || categoriesQuery.isLoading) return <SuspenseLoader />

  function handleCreateManyCategories(buf: ArrayBuffer) {
    createCategoriesMutation.mutate(buf)
  }

  function handleDeleteCategory(id: string) {
    deleteCategoryMutation.mutate(id)
  }

  function handleDeleteMultiCategories(ids: string[]) {
    deleteCategoriesMutation.mutate(ids)
  }

  return <Card>
    <CategoriesListTable 
      categories={data.results} 
      count={data.count} 
      isLoading={categoriesQuery.isLoading}
      onCreateManyCategories={handleCreateManyCategories} 
      onDelete={handleDeleteCategory}
      onMultiDelete={handleDeleteMultiCategories}
    />
  </Card>
}
