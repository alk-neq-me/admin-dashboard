import { Box, Card, CardContent, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Tooltip, Typography, useTheme } from "@mui/material"
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { UsersActions } from ".";
import { RenderProileAvatar, RenderUsernameLabel } from "@/components/table-labels";
import { User } from "@/services/types";

import { exportToExcel } from "@/libs/exportToExcel";
import { usePermission, useStore } from "@/hooks";
import { useNavigate } from "react-router-dom";
import { getUserPermissionsFn } from "@/services/permissionsApi";


const columnData: TableColumnHeader<User>[] = [
  {
    id: "name",
    align: "left",
    name: "Name"
  },
  {
    id: "role",
    align: "right",
    name: "Role"
  }
]

const columnHeader = columnData.concat([
  {
    id: "actions",
    align: "right",
    name: "Actions"
  }
])

interface UsersListTableProps {
  users: User[]
  count: number
  me: User
}

export function UsersListTable(props: UsersListTableProps) {
  const { users, count, me } = props

  const navigate = useNavigate()

  const theme = useTheme()
  const { state: {brandFilter}, dispatch } = useStore()

  const handleClickUpdateAction = (userId: string) => (_: React.MouseEvent<HTMLButtonElement>) => {
    navigate(`/users/change-role/${userId}`)
  }

  const handleOnExport = () => {
    exportToExcel(users, "Users")
  }

  const handleChangePagination = (_: any, page: number) => {
    dispatch({
      type: "SET_USER_FILTER",
      payload: {
        page: page += 1
      }
    })
  }

  const handleChangeLimit = (evt: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: "SET_USER_FILTER",
      payload: {
        limit: parseInt(evt.target.value, 10)
      }
    })
  }

  const isAllowedUpdateUser = usePermission({
    key: "user-permissions",
    actions: "update",
    queryFn: getUserPermissionsFn
  })

  return (
    <Card>
      <CardContent>
        <UsersActions onExport={handleOnExport} />
      </CardContent>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="left">Image</TableCell>

              {columnHeader.map(header => {
                const render = <TableCell key={header.id} align={header.align}>{header.name}</TableCell>
                return header.id !== "actions"
                  ? render
                  : isAllowedUpdateUser
                  ? render
                  : null
              })}
            </TableRow>
          </TableHead>

          <TableBody>
            {users.map(row => {
              return <TableRow
                hover
                key={row.id}
              >
                <TableCell align="left">
                  <RenderProileAvatar
                    src={row.image}
                    alt={row.name}
                  />
                </TableCell>
                {columnData.map(col => {
                  const key = col.id as keyof typeof row

                  return (
                    <TableCell align={col.align} key={col.id}>
                      <Typography
                        variant="body1"
                        fontWeight="normal"
                        color="text.primary"
                        gutterBottom
                        noWrap
                      >
                        {key === "name"
                        ? <RenderUsernameLabel user={row} me={me} />
                        : row[key] as string}
                      </Typography>
                    </TableCell>
                  )
                })}

                {isAllowedUpdateUser
                ? <TableCell align="right">
                    {isAllowedUpdateUser
                    ? <Tooltip title="Change Role" arrow>
                        <IconButton
                          sx={{
                            '&:hover': {
                              background: theme.colors.primary.lighter
                            },
                            color: theme.palette.primary.main
                          }}
                          onClick={handleClickUpdateAction(row.id)}
                          color="inherit"
                          size="small"
                        >
                          <AdminPanelSettingsIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    : null}
                  </TableCell>
                : null}
              </TableRow>
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Box p={2}>
        <TablePagination
          component="div"
          count={count}
          onPageChange={handleChangePagination}
          onRowsPerPageChange={handleChangeLimit}
          page={brandFilter?.page
            ? brandFilter.page - 1
            : 0}
          rowsPerPage={brandFilter?.limit || 10}
          rowsPerPageOptions={[5, 10, 25, 30]}
        />
      </Box>
    </Card>
  )
}
