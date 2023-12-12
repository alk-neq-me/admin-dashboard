import { Box, Card, CardContent, Grid, Typography } from "@mui/material";
import { MuiButton } from "@/components/ui";
import { AddDashboardCard, DashboardCard, SuspenseLoader } from "@/components";
import { useQuery } from "@tanstack/react-query";
import { getSalesCategoriesFn } from "@/services/salesCategoryApi";
import { usePermission, useStore } from "@/hooks";

import AddTwoToneIcon from '@mui/icons-material/AddTwoTone'
import { useNavigate } from "react-router-dom";
import { getSalesCategoryPermissionsFn } from "@/services/permissionsApi";


export function SalesCategoryCard() {
  const { state: {salesCategoryFilter}} = useStore()

  const navigate = useNavigate()

  const { data, isError, isLoading, error } = useQuery({
    queryKey: ["sales-categories", { filter: salesCategoryFilter } ],
    queryFn: args => getSalesCategoriesFn(args, { 
      filter: salesCategoryFilter?.fields,
      pagination: {
        page: salesCategoryFilter?.page || 1,
        pageSize: salesCategoryFilter?.limit || 2
      },
    }),
    select: data => data.results
  })

  const isAllowedCreateSalesCategory = usePermission({
    key: "sales-categor-permissions",
    actions: "create",
    queryFn: getSalesCategoryPermissionsFn
  })

  const handleCreateNewSalesCategory = (_: React.MouseEvent<HTMLButtonElement>) => {
    navigate("/sales-categories/create")
  }

  if (isError && error) return <h1>{error.message}</h1>

  if (isLoading || !data) return <SuspenseLoader />

  const firstSalesCategory = data[0]
  const secondSalesCategory = isAllowedCreateSalesCategory
    ? null
    : data[1]

  console.log({
    data,
    isAllowedCreateSalesCategory,
    firstSalesCategory,
    secondSalesCategory
  })

  return (
    <>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        sx={{ pb: 3 }}
      >
        <Typography variant="h3">Sales Categories</Typography>
        {isAllowedCreateSalesCategory
        ? <MuiButton
            size="small"
            variant="outlined"
            startIcon={<AddTwoToneIcon fontSize="small" />}
            onClick={handleCreateNewSalesCategory}
          >
            Add new sales category
          </MuiButton>
        : null}
      </Box>

      <Grid container spacing={3}>
        <Grid xs={12} sm={6} item>
          <Card  sx={{ px: 1 }}>
            <CardContent>
              <DashboardCard
                subtitle="SALES"
                value={firstSalesCategory.name}
                isDown={false}
                percent="12%"
                helperText="Since last month"
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid xs={12} sm={6} item>
          {secondSalesCategory
          ? <Card  sx={{ px: 1 }}>
              <CardContent>
                <DashboardCard
                  subtitle="SALES"
                  value={secondSalesCategory.name}
                  isDown={false}
                  percent="12%"
                  helperText="Since last month"
                />
              </CardContent>
            </Card>
          : isAllowedCreateSalesCategory 
          ? <AddDashboardCard 
              onClickAdd={() => navigate("/sales-categories/create")}
            />
          : null}
        </Grid>
      </Grid>
    </>
  )
}
