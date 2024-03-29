import { EnhancedTable, TypedColumn } from "@/components";
import {
  RenderBrandLabel,
  RenderCategoryLabel,
  RenderImageLabel,
  RenderProductDiscountLabel,
  RenderProductLabel,
  RenderProductStockStatus,
  RenderSalesCategoryLabel,
} from "@/components/table-labels";
import { CacheResource } from "@/context/cacheKey";
import { INITIAL_PAGINATION } from "@/context/store";
import { useStore } from "@/hooks";
import { numberFormat } from "@/libs/numberFormat";
import { Product, ProductStatus, Resource } from "@/services/types";
import {
  Box,
  Card,
  Divider,
  MenuItem,
  Select,
  SelectChangeEvent,
  TablePagination,
  Theme,
  Typography,
  useTheme,
} from "@mui/material";
import { useMemo } from "react";
import { ProductdsFilterForm } from ".";

const productStatus: {
  label: ProductStatus;
  color: (theme: Theme) => string;
}[] = [
  {
    label: "Draft" as const,
    color: (theme) => theme.colors.error.main,
  },
  {
    label: "Pending" as const,
    color: (theme) => theme.colors.warning.main,
  },
  {
    label: "Published" as const,
    color: (theme) => theme.colors.success.main,
  },
];

const columns: TypedColumn<Product>[] = [
  {
    id: "images",
    align: "left",
    name: "Image",
    render: ({ value }) => (
      <RenderImageLabel
        src={value.images[0] || "/default.png"}
        alt={value.title}
      />
    ),
  },
  {
    id: "title",
    align: "left",
    name: "Title",
    render: ({ value }) => <RenderProductLabel product={value} />,
  },
  {
    id: "price",
    align: "right",
    name: "Price",
    render: ({ value }) => (
      <Box display="flex" flexDirection="column">
        <Typography
          sx={{
            textDecoration: value.isDiscountItem ? "line-through" : null,
          }}
        >
          {numberFormat(value.marketPrice)}
        </Typography>
        {value.isDiscountItem
          ? <Typography>{numberFormat(value.price)}</Typography>
          : null}
      </Box>
    ),
  },
  {
    id: "brand",
    align: "right",
    name: "Brand",
    render: ({ value }) =>
      value.brand ? <RenderBrandLabel brand={value.brand} /> : null,
  },
  {
    id: "categories",
    align: "right",
    name: "Categories",
    render: ({ value }) => (
      <>
        {value.categories?.map(({ category }, idx) => (
          <RenderCategoryLabel key={idx} category={category} />
        ))}
      </>
    ),
  },
  {
    id: "salesCategory",
    align: "right",
    name: "Sales Categories",
    render: ({ value }) => (
      <>
        {value.salesCategory?.map(({ salesCategory }, idx) => (
          <RenderSalesCategoryLabel
            key={idx}
            salesCategory={salesCategory}
          />
        ))}
      </>
    ),
  },
  {
    id: "instockStatus",
    align: "right",
    name: "InstockStatus",
    render: ({ value }) => <RenderProductStockStatus product={value} />,
  },
  {
    id: "priceUnit",
    align: "right",
    name: "PriceUnit",
    render: ({ value }) => <Typography>{value.priceUnit}</Typography>,
  },
  {
    id: "discount",
    align: "right",
    name: "Discount",
    render: ({ value }) => <RenderProductDiscountLabel product={value} />,
  },
  {
    id: "isDiscountItem",
    align: "right",
    name: "Is discount item",
    render: ({ value }) => (
      <Typography>
        {value.isDiscountItem ? `Discounted: item` : "No"}
      </Typography>
    ),
  },
  {
    id: "creator",
    align: "right",
    name: "Shopowner group",
    render: ({ value }) => (
      <Typography>{value.creator?.shopownerProvider?.name}</Typography>
    ),
  },
];

interface ProductsListTableProps {
  products: Product[];
  count: number;
  isLoading?: boolean;
  onDelete?: (id: string) => void;
  onMultiDelete?: (ids: string[]) => void;
  onCreateMany?: (buf: ArrayBuffer) => void;
  onStatusChange: (product: Product, status: ProductStatus) => void;
}

export function ProductsListTable(props: ProductsListTableProps) {
  const {
    products,
    count,
    isLoading,
    onDelete,
    onMultiDelete,
    onCreateMany,
    onStatusChange,
  } = props;
  const { state: { productFilter: { pagination } }, dispatch } =
    useStore();

  const theme = useTheme();

  const handleChangeProductStatus =
    (product: Product) => (evt: SelectChangeEvent) => {
      const { value } = evt.target;
      onStatusChange(product, value as ProductStatus);
    };

  const columnsWithEditableStatus = useMemo(() =>
    columns.concat([
      {
        id: "status",
        align: "left",
        name: "Status",
        render: ({ value }) => (
          <Select
            labelId="order-status"
            value={value.status}
            onChange={handleChangeProductStatus(value)}
            size="small"
          >
            {productStatus.map(status => {
              return (
                <MenuItem
                  key={status.label}
                  value={status.label}
                >
                  <Typography color={status.color(theme)}>
                    {status.label}
                  </Typography>
                </MenuItem>
              );
            })}
          </Select>
        ),
      },
    ]), []);

  // // TODO: Excel export pepare
  // const handleOnExport = () => {
  //   const prepare = products.map(product => {
  //     const activeSale = product.salesCategory?.find(sale => sale.salesCategory.isActive)

  //     const toExport = {
  //       id: product.id,
  //       title: product.title,
  //       status: product.status,
  //       instockStatus: product.instockStatus,
  //       priceUnit: product.priceUnit,
  //       images: product.images.join("\n"),
  //       quantity: product.quantity,
  //       price: product.price,
  //       marketPrice: product.marketPrice,
  //       dealerPrice: product.dealerPrice,
  //       discount: product.discount,
  //       isDiscountItem: product.isDiscountItem,
  //       "brand.name": product.brand!.name
  //     } as Record<string, string | number | boolean | Date | undefined>

  //     if (activeSale?.salesCategory) {
  //       toExport["sales.name"] = activeSale.salesCategory.name
  //       toExport["sales.startDate"] = activeSale.salesCategory.startDate
  //       toExport["sales.endDate"] = activeSale.salesCategory.endDate
  //       toExport["sales.isActive"] = activeSale.salesCategory.isActive
  //       toExport["sales.discount"] = activeSale.discount
  //       toExport["sales.description"] = activeSale.salesCategory.description
  //     }

  //     return toExport
  //   })

  //   exportToExcel(prepare, "Products")
  // }

  const handleChangePagination = (_: any, page: number) => {
    dispatch({
      type: "SET_PRODUCT_PAGE",
      payload: page += 1,
    });
  };

  const handleChangeLimit = (evt: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: "SET_PRODUCT_PAGE_SIZE",
      payload: parseInt(evt.target.value, 10),
    });
  };

  return (
    <Card>
      <EnhancedTable
        refreshKey={[CacheResource.Product]}
        renderFilterForm={<ProductdsFilterForm />}
        rows={products}
        resource={Resource.Product}
        isLoading={isLoading}
        columns={columnsWithEditableStatus}
        onSingleDelete={onDelete}
        onMultiDelete={onMultiDelete}
        onMultiCreate={onCreateMany}
      />

      <Divider />

      <Box p={2}>
        <TablePagination
          component="div"
          count={count}
          onPageChange={handleChangePagination}
          onRowsPerPageChange={handleChangeLimit}
          page={pagination?.page
            ? pagination.page - 1
            : 0}
          rowsPerPage={pagination?.pageSize || INITIAL_PAGINATION.pageSize}
          rowsPerPageOptions={[5, 10, 25, 30, 100]}
        />
      </Box>
    </Card>
  );
}
