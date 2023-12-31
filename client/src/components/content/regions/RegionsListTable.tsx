import { Box, Card, CardContent, Checkbox, Divider, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Tooltip, Typography, useTheme } from "@mui/material"
import { useState } from "react"
import { BulkActions, LoadingTablePlaceholder } from "@/components";
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';

import { FormModal } from "@/components/forms";
import { convertToExcel, exportToExcel } from "@/libs/exportToExcel";
import { usePermission, useStore } from "@/hooks";
import { MuiButton } from "@/components/ui";

import { useNavigate } from "react-router-dom";
import { Region } from "@/services/types";
import { getRegionPermissionsFn } from "@/services/permissionsApi";
import { RegionsActions } from ".";
import { CreateRegionInput } from "./forms/CreateRegionForm";
import { RenderCityName } from "@/components/table-labels";



const columnData: TableColumnHeader<Region>[] = [
  {
    id: "name",
    align: "left",
    name: "Name"
  },
  {
    id: "cities",
    align: "left",
    name: "Cities"
  }
]

const columnHeader = columnData.concat([
  {
    id: "actions",
    align: "right",
    name: "Actions"
  }
])

interface RegionsListTableProps {
  regions: Region[]
  isLoading?: boolean
  count: number
  onDelete: (id: string) => void
  onMultiDelete: (ids: string[]) => void
  onCreateManyRegions: (buf: ArrayBuffer) => void
}

export function RegionsListTable(props: RegionsListTableProps) {
  const { regions, count, isLoading, onCreateManyRegions, onDelete, onMultiDelete } = props

  const [deleteId, setDeleteId] = useState("")

  const navigate = useNavigate()

  const theme = useTheme()
  const { state: {regionFilter, modalForm}, dispatch } = useStore()

  const [selectedRows, setSellectedRows] = useState<string[]>([])

  const selectedBulkActions = selectedRows.length > 0

  const handleSelectAll = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = evt.target
    setSellectedRows(checked
      ? regions.map(e => e.id)
      : []
    )
  }

  const handleSelectOne = (id: string) => (_: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedRows.includes(id)) setSellectedRows(prev => ([ ...prev, id ]))
    else setSellectedRows(prev => prev.filter(prevId => prevId !== id))
  }

  const handleClickDeleteAction = (regionId: string) => (_: React.MouseEvent<HTMLButtonElement>) => {
    setDeleteId(regionId)
    dispatch({
      type: "OPEN_MODAL_FORM",
      payload: "delete-region"
    })
  }

  const handleClickUpdateAction = (regionId: string) => (_: React.MouseEvent<HTMLButtonElement>) => {
    navigate(`/regions/update/${regionId}`)
  }

  const handleOnExport = () => {
    exportToExcel(regions, "Regions")
  }

  const handleOnImport = (data: CreateRegionInput[]) => {
    convertToExcel(data, "Regions")
      .then(excelBuffer => onCreateManyRegions(excelBuffer))
      .catch(err => dispatch({
        type: "OPEN_TOAST",
        payload: {
          message: `Failed Excel upload: ${err.message}`,
          severity: "error"
        }
      }))
  }

  const handleChangePagination = (_: any, page: number) => {
    dispatch({
      type: "SET_REGION_FILTER",
      payload: {
        page: page += 1
      }
    })
  }

  const handleChangeLimit = (evt: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: "SET_REGION_FILTER", payload: { limit: parseInt(evt.target.value, 10) } }) }

  const handleCloseDeleteModal = () => {
    dispatch({
      type: "CLOSE_ALL_MODAL_FORM"
    })
  }

  const isAllowedDeleteRegion = usePermission({
    key: "region-permissions",
    actions: "delete",
    queryFn: getRegionPermissionsFn
  })

  const isAllowedUpdateRegion = usePermission({
    key: "region-permissions",
    actions: "update",
    queryFn: getRegionPermissionsFn
  })

  const isAllowedCreateBrand = usePermission({
    key: "region-permissions",
    actions: "create",
    queryFn: getRegionPermissionsFn
  })

  const selectedAllRows = selectedRows.length === regions.length
  const selectedSomeRows = selectedRows.length > 0 && 
    selectedRows.length < regions.length

  return (
    <Card>
      {selectedBulkActions && <Box flex={1} p={2}>
        <BulkActions
          field="delete-region-multi"
          isAllowedDelete={isAllowedDeleteRegion}
          onDelete={() => onMultiDelete(selectedRows)}
        />
      </Box>}

      <Divider />

      <CardContent>
        <RegionsActions 
          onExport={handleOnExport} 
          onImport={handleOnImport}  
          isAllowedImport={isAllowedCreateBrand}
        />
      </CardContent>

      <TableContainer>
        {isLoading
        ? <LoadingTablePlaceholder />
        : <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  color="primary"
                  checked={selectedAllRows}
                  indeterminate={selectedSomeRows}
                  onChange={handleSelectAll}
                />
              </TableCell>

              {columnHeader.map(header => {
                const render = <TableCell key={header.id} align={header.align}>{header.name}</TableCell>
                return header.id !== "actions"
                  ? render
                  : isAllowedUpdateRegion && isAllowedDeleteRegion
                  ? render
                  : null
              })}
            </TableRow>
          </TableHead>

          <TableBody>
            {regions.map(row => {
              const isSelected = selectedRows.includes(row.id)
              return <TableRow
                hover
                key={row.id}
                selected={isSelected}
              >
                <TableCell padding="checkbox">
                  <Checkbox
                    color="primary"
                    checked={isSelected}
                    onChange={handleSelectOne(row.id)}
                    value={isSelected}
                  />
                </TableCell>

                {columnData.map(col => <TableCell align={col.align} key={col.id}>
                  <Typography
                    variant="body1"
                    fontWeight="normal"
                    color="text.primary"
                    gutterBottom
                    noWrap
                  >
                    {col.id === "name" && row.name}
                    {col.id === "cities" && row.cities && row.cities.map(city => <RenderCityName key={city.id} city={city} />)}
                  </Typography>
                </TableCell>)}

                {isAllowedUpdateRegion && isAllowedDeleteRegion
                ? <TableCell align="right">
                    {isAllowedUpdateRegion
                    ? <Tooltip title="Edit Product" arrow>
                        <IconButton
                          sx={{
                            '&:hover': {
                              background: theme.colors.primary.lighter
                            },
                            color: theme.palette.primary.main
                          }}
                          color="inherit"
                          size="small"
                          onClick={handleClickUpdateAction(row.id)}
                        >
                          <EditTwoToneIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    : null}

                    {isAllowedDeleteRegion
                    ? <Tooltip title="Delete Product" arrow>
                        <IconButton
                          sx={{
                            '&:hover': {
                              background: theme.colors.error.lighter
                            },
                            color: theme.palette.error.main
                          }}
                          onClick={handleClickDeleteAction(row.id)}
                          color="inherit"
                          size="small"
                        >
                          <DeleteTwoToneIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    : null}
                  </TableCell>
                : null}
              </TableRow>
            })}
          </TableBody>
        </Table>}
      </TableContainer>

      <Box p={2}>
        <TablePagination
          component="div"
          count={count}
          onPageChange={handleChangePagination}
          onRowsPerPageChange={handleChangeLimit}
          page={regionFilter?.page
            ? regionFilter.page - 1
            : 0}
          rowsPerPage={regionFilter?.limit || 10}
          rowsPerPageOptions={[5, 10, 25, 30]}
        />
      </Box>

      {modalForm.field === "delete-region"
      ? <FormModal
        field="delete-region"
        title="Delete region"
        onClose={handleCloseDeleteModal}
      >
        <Box display="flex" flexDirection="column" gap={1}>
          <Box>
            <Typography>Are you sure want to delete</Typography>
          </Box>
          <Box display="flex" flexDirection="row" gap={1}>
            <MuiButton variant="contained" color="error" onClick={() => onDelete(deleteId)}>Delete</MuiButton>
            <MuiButton variant="outlined" onClick={() => dispatch({ type: "CLOSE_ALL_MODAL_FORM" })}>Cancel</MuiButton>
          </Box>
        </Box>
      </FormModal>
      : null}
    </Card>
  )
}
