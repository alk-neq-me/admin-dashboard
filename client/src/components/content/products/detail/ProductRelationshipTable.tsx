import {
  RenderBrandLabel,
  RenderSalesCategoryLabel,
} from "@/components/table-labels";
import { RenderCategoryLabel } from "@/components/table-labels/RenderCategoryLabel";
import { Brand, Product } from "@/services/types";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import AppError, { AppErrorKind } from "@/libs/exceptions";

const columnHeader: {
  id: string;
  align: "left" | "right";
  name: string;
}[] = [
  {
    id: "relationship",
    align: "left",
    name: "relationship",
  },
  {
    id: "value",
    align: "left",
    name: "Value",
  },
];

interface ProductRelationshipTableProps {
  brand: Brand | undefined;
  categories: Product["categories"];
  salesCategories: Product["salesCategory"];
}

export default function ProductRelationshipTable(
  props: ProductRelationshipTableProps,
) {
  const { brand, categories, salesCategories } = props;

  if (!brand) {
    throw AppError.new(
      AppErrorKind.InvalidInputError,
      "Product should have brand",
    );
  }

  const rows = [
    {
      id: "1",
      relative: "brand",
      render: () => <RenderBrandLabel brand={brand} />,
    },
    {
      id: "2",
      relative: "categories",
      render: () =>
        categories?.map(cat => (
          <RenderCategoryLabel
            key={cat.categoryId}
            category={cat.category}
          />
        )),
    },
    {
      id: "3",
      relative: "sales categories",
      render: () =>
        salesCategories?.map(sale => (
          <RenderSalesCategoryLabel
            key={sale.salesCategoryId}
            salesCategory={sale.salesCategory}
          />
        )),
    },
  ];

  return (
    <Box display="flex" flexDirection="column" gap={3} mt={3}>
      <Typography variant="h3" fontWeight={600}>
        Relative information
      </Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="product specification">
          <TableHead>
            <TableRow>
              {columnHeader.map(col => {
                return (
                  <TableCell key={col.id} align={col.align}>
                    {col.name}
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>

          <TableBody>
            {rows.map(row => {
              return (
                <TableRow key={row.id}>
                  <TableCell>{row.relative}</TableCell>
                  <TableCell>{row.render()}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
