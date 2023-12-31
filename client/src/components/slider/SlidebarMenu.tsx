import { useState } from "react";
import { Box, Collapse, List, ListItem, ListSubheader, alpha, styled } from "@mui/material"
import { MuiButton } from '@/components/ui'
import { useLocation, useNavigate } from 'react-router-dom'
import { useStore } from "@/hooks"
import clsx from "clsx";

import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LoyaltyIcon from '@mui/icons-material/Loyalty';
import PeopleIcon from '@mui/icons-material/People';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import DesignServicesTwoToneIcon from '@mui/icons-material/DesignServicesTwoTone';
import GradingIcon from '@mui/icons-material/Grading';
import SettingsIcon from '@mui/icons-material/Settings';
import InventoryIcon from '@mui/icons-material/Inventory';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CategoryIcon from '@mui/icons-material/Category';
import SellIcon from '@mui/icons-material/Sell';
import BadgeIcon from '@mui/icons-material/Badge';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import LocationCityIcon from '@mui/icons-material/LocationCity';


const DotWrapper = styled(Box)(({theme}) => ({
  padding: 2,
  borderRadius: "100%",
  margin: "0 12px 0 0",
  background: theme.colors.alpha.trueWhite[50]
}))

const MenuWrapper = styled(Box)(({theme}) => ({
  ".MuiList-root": {
    padding: theme.spacing(1),
    "& > .MuiList-root": {
      padding: `0 ${theme.spacing(0)} ${theme.spacing(1)}`
    }
  },

  ".MuiListSubheader-root": {
    textTransform: "uppercase",
    fontWeight: "bold",
    fontSize: theme.typography.pxToRem(12),
    color: theme.colors.alpha.trueWhite[50],
    padding: theme.spacing(0, 2.5),
    lineHeight: 1.4
  }
}))

const SubMenuWrapper = styled(Box)(({theme}) => ({
  ".MuiList-root": {
    ".MuiListItem-root": {
      padding: "1px 0",

      ".MuiBadge-root": {
        position: "absolute",
        right: theme.spacing(3.2),

        ".MuiBadge-standard": {
          background: theme.colors.primary.main,
          fontSize: theme.typography.pxToRem(10),
          fontWeight: "bold",
          textTransform: "uppercase",
          color: theme.palette.primary.contrastText
        }
      },

      ".MuiButton-root": {
        display: "flex",
        color: theme.colors.alpha.trueWhite[70],
        backgroundColor: "transparent",
        width: "100%",
        justifyContent: "flex-start",
        padding: theme.spacing(1.2, 3),

        ".MuiButton-startIcon, .MuiButton-endIcon": {
          transition: theme.transitions.create(["color"]),

          ".MuiSvgIcon-root": {
            fontSize: "inherit",
            transition: "none"
          }
        },

        ".MuiButton-startIcon": {
          color: theme.colors.alpha.trueWhite[30],
          fontSize: theme.typography.pxToRem(20),
          marginRight: theme.spacing(1)
        },

        ".MuiButton-endIcon": {
          color: theme.colors.alpha.trueWhite[50],
          marginLeft: "auto",
          opacity: .8,
          fontSize: theme.typography.pxToRem(20)
        },

        "&.active, &:hover": {
          backgroundColor: alpha(theme.colors.alpha.trueWhite[100], 0.06),
          color: theme.colors.alpha.trueWhite[100],

          ".MuiButton-startIcon, .MuiButton-endIcon": {
            color: theme.colors.alpha.trueWhite[100]
          }
        }
      },

      "&.Mui-children": {
        flexDirection: "column",
        ".MuiBadge-root": {
          position: "absolute",
          right: theme.spacing(7)
        }
      },

      ".MuiCollapse-root": {
        width: "100%",

        ".MuiList-root": {
          padding: theme.spacing(1, 0),
        },

        ".MuiListItem-root": {
          padding: "1px 0",

          ".MuiButton-root": {
            padding: theme.spacing(0.8, 3),

            ".MuiBadge-root": {
              right: theme.spacing(3.2)
            },

            "&:before": {
              content: "' '",
              background: theme.colors.alpha.trueWhite[100],
              opacity: 0,
              transition: theme.transitions.create(["transform", "opacity"]),
              width: "6px",
              height: "6px",
              transform: "scale(0)",
              transformOrigin: "center",
              borderRadius: "20px",
              marginRight: theme.spacing(1.8)
            },

            "&.active, &:hover": {
              "&:before": {
                transform: "scale(1)",
                opacity: 1
              }
            }
          }
        }
      }
    }
  }
}))

type ExpandMenu = {
  id:
    | "*"
    | "products"
    | "cities"
    | "regions"
    | "categories"
    | "brands"
    | "sales-categories"
    | "exchanges"
    | "users"
    | "coupons"
  state: boolean
}

type PageMenu = 
  | "overview"
  | "inventory"
  | "orders"
  | "settings"

type ExculdeWildcard<T extends string> = T extends "*" ? never : T
type MenuPath<T extends string> = `/${T}`
type ExpandableMenu<T extends string> = T | `${T}/list` | `${T}/create`

type SlideMenue = 
  | MenuPath<PageMenu>
  | MenuPath<ExpandableMenu<ExculdeWildcard<ExpandMenu["id"]>>>


export default function SlidebarMenu() {
  const { dispatch } = useStore()

  const navigate = useNavigate()
  const location = useLocation()
  const currentMenu = location.pathname as SlideMenue ?? "/overview"

  const [isExpandMenu, setIsExpandMenu] = useState<ExpandMenu>({
    id: "*",
    state: false
  })


  const handleOpenMenu = (menue: SlideMenue) => (_: React.MouseEvent<HTMLButtonElement>) => {
    navigate(menue)
    dispatch({
      type: "CLOSE_SLIDEBAR"
    })
  }

  const handleToggleExpandMenu = (id: ExpandMenu["id"]) => (_: React.MouseEvent<HTMLButtonElement>) => {
    if (isExpandMenu.id !== id && isExpandMenu.state) {
      setIsExpandMenu({ id, state: true })
      return
    }
    setIsExpandMenu(prev => ({
      id,
      state: !prev.state
    }))
  }

  const getStateCurrentExpandMenu = (id: ExpandMenu["id"]) => {
    return isExpandMenu.id === id
      ? isExpandMenu.state
      : false
  }

  return (
    <>
      <MenuWrapper>
        <List component="div">
          <SubMenuWrapper>
            <List component="div">
              <ListItem component="div">
                <MuiButton
                  className={clsx({"active": currentMenu === "/overview" })}
                  onClick={handleOpenMenu("/overview")}
                  startIcon={<DesignServicesTwoToneIcon />}
                >
                  Overview
                </MuiButton>
              </ListItem>
            </List>
          </SubMenuWrapper>
        </List>

        <List
          component="div"
          subheader={
            <ListSubheader component="div" disableSticky>
              Dashboards
            </ListSubheader>
          }
        >
          <SubMenuWrapper>
            <List component="div">
              <ListItem component="div">
                <MuiButton
                  className={clsx({"active": currentMenu === "/inventory" })}
                  onClick={handleOpenMenu("/inventory")}
                  startIcon={<InventoryIcon />}
                >
                  Inventory
                </MuiButton>
              </ListItem>
              <ListItem component="div">
                <MuiButton
                  className={clsx({"active": currentMenu === "/orders" })}
                  onClick={handleOpenMenu("/orders")}
                  startIcon={<GradingIcon />}
                >
                  Orders
                </MuiButton>
              </ListItem>
              <ListItem component="div">
                <MuiButton
                  className={clsx({"active": currentMenu === "/settings" })}
                  onClick={handleOpenMenu("/settings")}
                  startIcon={<SettingsIcon />}
                >
                  Settings
                </MuiButton>
              </ListItem>
            </List>
          </SubMenuWrapper>
        </List>

        <List
          component="div"
          subheader={
            <ListSubheader component="div" disableSticky>
              E-Commerce
            </ListSubheader>
          }
        >
          <SubMenuWrapper>
            <List component="div">
              {/* Products Menues */}
              <ListItem component="div">
                <MuiButton
                  onClick={handleToggleExpandMenu("products")}
                  startIcon={<ShoppingCartIcon />}
                  endIcon={getStateCurrentExpandMenu("products")
                    ? <ExpandLessIcon />
                    : <ExpandMoreIcon />
                  }
                >
                  Products
                </MuiButton>
              </ListItem>

              <Collapse in={getStateCurrentExpandMenu("products")}>
                <List component="div" disablePadding>
                  <ListItem component="div">
                    <MuiButton
                      className={clsx({"active": currentMenu === "/products/list" })}
                      onClick={handleOpenMenu("/products/list")}
                    >
                      <DotWrapper />
                      List
                    </MuiButton>
                  </ListItem>
                  <ListItem component="div">
                    <MuiButton
                      className={clsx({"active": currentMenu === "/products/create" })}
                      onClick={handleOpenMenu("/products/create")}
                    >
                      <DotWrapper />
                      Create
                    </MuiButton>
                  </ListItem>
                </List>
              </Collapse>

              {/* Regions Menues */}
              <ListItem component="div">
                <MuiButton
                  onClick={handleToggleExpandMenu("regions")}
                  startIcon={<DirectionsBusIcon />}
                  endIcon={getStateCurrentExpandMenu("regions")
                    ? <ExpandLessIcon />
                    : <ExpandMoreIcon />
                  }
                >
                  Regions
                </MuiButton>
              </ListItem>

              <Collapse in={getStateCurrentExpandMenu("regions")}>
                <List component="div" disablePadding>
                  <ListItem component="div">
                    <MuiButton
                      className={clsx({"active": currentMenu === "/regions/list" })}
                      onClick={handleOpenMenu("/regions/list")}
                    >
                      <DotWrapper />
                      List
                    </MuiButton>
                  </ListItem>
                  <ListItem component="div">
                    <MuiButton
                      className={clsx({"active": currentMenu === "/regions/create" })}
                      onClick={handleOpenMenu("/regions/create")}
                    >
                      <DotWrapper />
                      Create
                    </MuiButton>
                  </ListItem>
                </List>
              </Collapse>

              {/* Cities Menues */}
              <ListItem component="div">
                <MuiButton
                  onClick={handleToggleExpandMenu("cities")}
                  startIcon={<LocationCityIcon />}
                  endIcon={getStateCurrentExpandMenu("cities")
                    ? <ExpandLessIcon />
                    : <ExpandMoreIcon />
                  }
                >
                  Cities
                </MuiButton>
              </ListItem>

              <Collapse in={getStateCurrentExpandMenu("cities")}>
                <List component="div" disablePadding>
                  <ListItem component="div">
                    <MuiButton
                      className={clsx({"active": currentMenu === "/cities/list" })}
                      onClick={handleOpenMenu("/cities/list")}
                    >
                      <DotWrapper />
                      List
                    </MuiButton>
                  </ListItem>
                  <ListItem component="div">
                    <MuiButton
                      className={clsx({"active": currentMenu === "/cities/create" })}
                      onClick={handleOpenMenu("/cities/create")}
                    >
                      <DotWrapper />
                      Create
                    </MuiButton>
                  </ListItem>
                </List>
              </Collapse>

              {/* Coupon Menues */}
              <ListItem component="div">
                <MuiButton
                  onClick={handleToggleExpandMenu("coupons")}
                  startIcon={<BadgeIcon />}
                  endIcon={getStateCurrentExpandMenu("coupons")
                    ? <ExpandLessIcon />
                    : <ExpandMoreIcon />
                  }
                >
                  Coupons
                </MuiButton>
              </ListItem>

              <Collapse in={getStateCurrentExpandMenu("coupons")}>
                <List component="div" disablePadding>
                  <ListItem component="div">
                    <MuiButton
                      className={clsx({"active": currentMenu === "/coupons/list" })}
                      onClick={handleOpenMenu("/coupons/list")}
                    >
                      <DotWrapper />
                      List
                    </MuiButton>
                  </ListItem>
                  <ListItem component="div">
                    <MuiButton
                      className={clsx({"active": currentMenu === "/coupons/create" })}
                      onClick={handleOpenMenu("/coupons/create")}
                    >
                      <DotWrapper />
                      Create
                    </MuiButton>
                  </ListItem>
                </List>
              </Collapse>

              {/* User Menues */}
              <ListItem component="div">
                <MuiButton
                  onClick={handleToggleExpandMenu("users")}
                  startIcon={<PeopleIcon />}
                  endIcon={getStateCurrentExpandMenu("users")
                    ? <ExpandLessIcon />
                    : <ExpandMoreIcon />
                  }
                >
                  Users
                </MuiButton>
              </ListItem>

              <Collapse in={getStateCurrentExpandMenu("users")}>
                <List component="div" disablePadding>
                  <ListItem component="div">
                    <MuiButton
                      className={clsx({"active": currentMenu === "/users/list" })}
                      onClick={handleOpenMenu("/users/list")}
                    >
                      <DotWrapper />
                      List
                    </MuiButton>
                  </ListItem>
                </List>
              </Collapse>

              {/* Exchange Menues */}
              <ListItem component="div">
                <MuiButton
                  onClick={handleToggleExpandMenu("exchanges")}
                  startIcon={<AttachMoneyIcon />}
                  endIcon={getStateCurrentExpandMenu("exchanges")
                    ? <ExpandLessIcon />
                    : <ExpandMoreIcon />
                  }
                >
                  Exchange
                </MuiButton>
              </ListItem>

              <Collapse in={getStateCurrentExpandMenu("exchanges")}>
                <List component="div" disablePadding>
                  <ListItem component="div">
                    <MuiButton
                      className={clsx({"active": currentMenu === "/exchanges/list" })}
                      onClick={handleOpenMenu("/exchanges/list")}
                    >
                      <DotWrapper />
                      List
                    </MuiButton>
                  </ListItem>
                  <ListItem component="div">
                    <MuiButton
                      className={clsx({"active": currentMenu === "/exchanges/create" })}
                      onClick={handleOpenMenu("/exchanges/create")}
                    >
                      <DotWrapper />
                      Create
                    </MuiButton>
                  </ListItem>
                </List>
              </Collapse>

              {/* Brand Menues */}
              <ListItem component="div">
                <MuiButton
                  onClick={handleToggleExpandMenu("brands")}
                  startIcon={<SellIcon />}
                  endIcon={getStateCurrentExpandMenu("brands")
                    ? <ExpandLessIcon />
                    : <ExpandMoreIcon />
                  }
                >
                  Brands
                </MuiButton>
              </ListItem>

              <Collapse in={getStateCurrentExpandMenu("brands")}>
                <List component="div" disablePadding>
                  <ListItem component="div">
                    <MuiButton
                      className={clsx({"active": currentMenu === "/brands/list" })}
                      onClick={handleOpenMenu("/brands/list")}
                    >
                      <DotWrapper />
                      List
                    </MuiButton>
                  </ListItem>
                  <ListItem component="div">
                    <MuiButton
                      className={clsx({"active": currentMenu === "/brands/create" })}
                      onClick={handleOpenMenu("/brands/create")}
                    >
                      <DotWrapper />
                      Create
                    </MuiButton>
                  </ListItem>
                </List>
              </Collapse>

              {/* Categories Menues */}
              <ListItem component="div">
                <MuiButton
                  onClick={handleToggleExpandMenu("categories")}
                  startIcon={<CategoryIcon />}
                  endIcon={getStateCurrentExpandMenu("categories")
                    ? <ExpandLessIcon />
                    : <ExpandMoreIcon />
                  }
                >
                  Categories
                </MuiButton>
              </ListItem>

              <Collapse in={getStateCurrentExpandMenu("categories")}>
                <List component="div" disablePadding>
                  <ListItem component="div">
                    <MuiButton
                      className={clsx({"active": currentMenu === "/categories/list" })}
                      onClick={handleOpenMenu("/categories/list")}
                    >
                      <DotWrapper />
                      List
                    </MuiButton>
                  </ListItem>
                  <ListItem component="div">
                    <MuiButton
                      className={clsx({"active": currentMenu === "/categories/create" })}
                      onClick={handleOpenMenu("/categories/create")}
                    >
                      <DotWrapper />
                      Create
                    </MuiButton>
                  </ListItem>
                </List>
              </Collapse>

              {/* Sales categories Menues */}
              <ListItem component="div">
                <MuiButton
                  onClick={handleToggleExpandMenu("sales-categories")}
                  startIcon={<LoyaltyIcon />}
                  endIcon={getStateCurrentExpandMenu("sales-categories")
                    ? <ExpandLessIcon />
                    : <ExpandMoreIcon />
                  }
                >
                  Sales categories
                </MuiButton>
              </ListItem>

              <Collapse in={getStateCurrentExpandMenu("sales-categories")}>
                <List component="div" disablePadding>
                  <ListItem component="div">
                    <MuiButton
                      className={clsx({"active": currentMenu === "/sales-categories/list" })}
                      onClick={handleOpenMenu("/sales-categories/list")}
                    >
                      <DotWrapper />
                      List
                    </MuiButton>
                  </ListItem>
                  <ListItem component="div">
                    <MuiButton
                      className={clsx({"active": currentMenu === "/sales-categories/create" })}
                      onClick={handleOpenMenu("/sales-categories/create")}
                    >
                      <DotWrapper />
                      Create
                    </MuiButton>
                  </ListItem>
                </List>
              </Collapse>

            </List>
          </SubMenuWrapper>
        </List>

      </MenuWrapper>
    </>
  )
}
