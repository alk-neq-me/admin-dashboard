import { Autocomplete, Paper, TextField, styled } from '@mui/material';
import { MuiButton } from '@/components/ui';
import { Controller, useFormContext } from 'react-hook-form';
import { Category } from '@/services/types';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { getCategoriesFn } from '@/services/categoryApi';
import { useStore } from '@/hooks';
import filter from 'lodash/filter';

import CircularProgress from '@mui/material/CircularProgress';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';


const InnerPaper = styled(Paper)(() => ({
  padding: "10px"
}))


interface CatgoryMultiInputFieldProps {
  updateField?: boolean
}

export function CatgoryMultiInputField({updateField = false}: CatgoryMultiInputFieldProps) {
  const { control, setValue, getValues, formState: { errors } } = useFormContext<{ categories: string[] }>()
  const [ selectedCategories, setSelectedCategories ] = useState<Pick<Category, "id" | "name">[]>([])
  const [ isOpenOptions, setIsOpenOptions ] = useState(false)

  const { dispatch } = useStore()

  const {
    data: categories,
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ["categories"],
    queryFn: args => getCategoriesFn(args, { 
      filter: {},
      pagination: {
        page: 1,
        pageSize: 100 * 1000
      }
    }),
    select: data => data.results
  })

  const defaultCategoryIds = getValues("categories")
  const defaultCategories = defaultCategoryIds
    ? filter(categories, (category) => defaultCategoryIds.includes(category.id))
    : []

  useEffect(() => {
    if (defaultCategories.length && updateField) setSelectedCategories(defaultCategories)
  }, [defaultCategories.length])


  const handleCategoryChange = (_: React.SyntheticEvent, value: Pick<Category, "id" | "name">[] | null) => {
    if (value) {
      setSelectedCategories(value)
      setValue("categories", value.map(v => v.id))
    }
  }

  const handleOnClickCreateNew = (_: React.MouseEvent<HTMLButtonElement>) => {
    dispatch({ type: "OPEN_MODAL_FORM", payload: "categories" })
  }

  const handleOnCloseOptions = (_: React.SyntheticEvent) => new Promise(resolve => setTimeout(() => resolve(setIsOpenOptions(false)), 200))

  if (isError) return <Autocomplete
      options={[]}
      disabled
      renderInput={params => <TextField 
        {...params}
        error={true}
        label="Failed category autocomplete"
        fullWidth
        helperText={error?.message}
      />}
    />

  return <>
    <Controller
      name="categories"
      control={control}
      render={({field}) => (
        <Autocomplete
          {...field}
          open={isOpenOptions}
          onOpen={() => setIsOpenOptions(true)}
          onClose={handleOnCloseOptions}
          multiple
          value={selectedCategories}
          options={categories || []}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          getOptionLabel={option => option.name || ""}
          loading={isLoading}
          renderOption={(props, option) => (
            <li {...props} style={{ display: 'block' }}>
              {option.name}
            </li>
          )}
          PaperComponent={({children}) => <InnerPaper>
            {children}
            <MuiButton
              fullWidth
              startIcon={<AddTwoToneIcon />}
              variant="outlined"
              onClick={handleOnClickCreateNew}
            >
              Create new
            </MuiButton>
          </InnerPaper>}
          renderInput={params => <TextField
            {...params}
            error={!!errors.categories}
            helperText={errors.categories?.message || ""}
            label="Categories"
            InputProps={{
              ...params.InputProps,
              endAdornment: <>
                {isLoading && <CircularProgress color='primary' size={20} />}
                {params.InputProps.endAdornment}
              </>
            }}
          />}
          onChange={handleCategoryChange}
        />
      )}
    />
  </>
}

