import { ErrorBoundary, PagePermission } from "@/components";
import { Navigate, createBrowserRouter } from "react-router-dom";
import Loader from "./loader";
import { lazy } from "react";
import { BaseLayout, SlidebarLayout } from "@/layouts";
import { brandPermissionsLoader, categoryPermissionsLoader, exchangePermissionsLoader, productPermissionsLoader, salesCategoryPermissionsLoader, userPermissionsLoader } from "./permissionLoader";

const HomePage = Loader(lazy(() => import("@/pages/home.page")))

// Status
const Status404Page = Loader(lazy(() => import("@/pages/status404.page")))
const StatusUnauthorizedPage = Loader(lazy(() => import("@/pages/unauthorized.page")))

// produts
const ListExchangePage = Loader(lazy(() => import("@/pages/exchanges/ListExchange")))
const CreateExchangePage = Loader(lazy(() => import("@/pages/exchanges/CreateExchange")))
const UpdateExchangePage = Loader(lazy(() => import("@/pages/exchanges/UpdateExchange")))

// Auth
const RegisterPage = Loader(lazy(() => import("@/pages/register.page")))
const LoginPage = Loader(lazy(() => import("@/pages/login.page")))

// produts
const ListProductPage = Loader(lazy(() => import("@/pages/products/ListProduct")))
const CreateProductPage = Loader(lazy(() => import("@/pages/products/CreateProduct")))

// users
const ListUserPage = Loader(lazy(() => import("@/pages/users/ListUser")))
const UpdateUserPage = Loader(lazy(() => import("@/pages/users/UpdateUser")))

// brands
const ListBrandPage = Loader(lazy(() => import("@/pages/brands/ListBrand")))
const CreateBrandPage = Loader(lazy(() => import("@/pages/brands/CreateBrand")))
const UpdateBrandPage = Loader(lazy(() => import("@/pages/brands/UpdateBrand")))

// categories
const ListCategoryPage = Loader(lazy(() => import("@/pages/categories/ListCategory")))
const CreateCategoryPage = Loader(lazy(() => import("@/pages/categories/CreateCategory")))

// sales categories
const ListSalesCategoryPage = Loader(lazy(() => import("@/pages/salesCategories/ListSalesCategory")))
const CreateSalesCategoryPage = Loader(lazy(() => import("@/pages/salesCategories/CreateSalesCategory")))


const routes = createBrowserRouter([
  {
    path: "",
    ErrorBoundary,
    children: [
      /// MAIN ROUTES
      {
        path: "",
        Component: SlidebarLayout,
        children: [
          {
            path: "",
            Component: HomePage
          },

          {
            path: "home",
            element: <Navigate to="/" />
          },

          /// EXCHANGES ROUTES
          {
            path: "exchanges",
            loader: exchangePermissionsLoader,
            children: [
              {
                path: "",
                element: <Navigate to="/exchanges/list" />
              },
              {
                path: "list",
                Component: ListExchangePage
              },
              {
                path: "create",
                element: <PagePermission allowedRoles={["Admin", "Employee"]} />,
                children: [
                  {
                    path: "",
                    Component: CreateExchangePage
                  }
                ]
              },
              {
                path: "update/:exchangeId",
                element: <PagePermission allowedRoles={["Admin", "Employee"]} />,
                children: [
                  {
                    path: "",
                    Component: UpdateExchangePage
                  }
                ]
              },
            ]
          },


          /// USER ROUTES
          {
            path: "users",
            loader: userPermissionsLoader,
            children: [
              {
                path: "",
                element: <Navigate to="/brands/list" />
              },
              {
                path: "list",
                Component: ListUserPage
              },
              {
                path: "change-role/:userId",
                element: <PagePermission allowedRoles={["Admin", "Employee"]} />,
                children: [
                  {
                    path: "",
                    Component: UpdateUserPage
                  }
                ]
              },
            ]
          },


          /// BRAND ROUTES
          {
            path: "brands",
            loader: brandPermissionsLoader,
            children: [
              {
                path: "",
                element: <Navigate to="/brands/list" />
              },
              {
                path: "list",
                Component: ListBrandPage
              },
              {
                path: "create",
                element: <PagePermission allowedRoles={["Admin", "Employee"]} />,
                children: [
                  {
                    path: "",
                    Component: CreateBrandPage
                  }
                ]
              },
              {
                path: "update/:brandId",
                element: <PagePermission allowedRoles={["Admin", "Employee"]} />,
                children: [
                  {
                    path: "",
                    Component: UpdateBrandPage
                  }
                ]
              },
            ]
          },

          /// SALES-CATEGORY ROUTES
          {
            path: "sales-categories",
            loader: salesCategoryPermissionsLoader,
            children: [
              {
                path: "",
                element: <Navigate to="/sales-categories/list" />
              },
              {
                path: "list",
                Component: ListSalesCategoryPage
              },
              {
                path: "create",
                element: <PagePermission allowedRoles={["Admin", "Employee"]} />,
                children: [
                  {
                    path: "",
                    Component: CreateSalesCategoryPage
                  }
                ]
              }
            ]
          },

          /// CATEGORY ROUTES
          {
            path: "categories",
            loader: categoryPermissionsLoader,
            children: [
              {
                path: "",
                element: <Navigate to="/categories/list" />
              },
              {
                path: "list",
                Component: ListCategoryPage
              },
              {
                path: "create",
                element: <PagePermission allowedRoles={["Admin", "Employee"]} />,
                children: [
                  {
                    path: "",
                    Component: CreateCategoryPage
                  }
                ]
              }
            ]
          },

          /// PRODUCT ROUTES
          {
            path: "products",
            loader: productPermissionsLoader,
            children: [
              {
                path: "",
                element: <Navigate to="/products/list" />
              },
              {
                path: "list",
                Component: ListProductPage
              },
              {
                path: "create",
                element: <PagePermission allowedRoles={["Admin", "Employee"]} />,
                children: [
                  {
                    path: "",
                    Component: CreateProductPage
                  }
                ]
              }
            ]
          },
        ]
      },

      /// AUTHORIZATION ROUTES
      {
        path: "auth",
        Component: BaseLayout,
        children: [
          {
            path: "register",
            Component: RegisterPage,
          },
          {
            path: "login",
            Component: LoginPage
          }
        ]
      },

      /// STATUS ROUTES
      {
        path: "status",
        Component: BaseLayout,
        children: [
          {
            path: "404",
            Component: Status404Page
          },

          {
            path: "unauthorized",
            Component: StatusUnauthorizedPage
          },

          {
            path: "500",
            Component: ErrorBoundary
          }
        ]
      },

      {
        path: "dashboard",
        element: <Navigate to="" />
      },

      {
        path: "*",
        Component: Status404Page
      },
    ]
  },

  // TEST ROUTES
  {
    path: "test",
    Component: SlidebarLayout,
    children: [
      {
        path: "brandinput",
        Component: CreateProductPage
      }
    ]
  }
])


export default routes
