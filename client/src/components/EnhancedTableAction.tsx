import { queryClient } from "@/components";
import { usePermission } from "@/hooks/usePermission";
import { OperationAction, Resource } from "@/services/types";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Popover,
  styled,
  Tooltip,
  Typography,
} from "@mui/material";
import { useRef, useState } from "react";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ImportIcon from "@mui/icons-material/MoveToInbox";
import RefreshIcon from "@mui/icons-material/Refresh";
import ExportIcon from "@mui/icons-material/Upgrade";

import * as XLSX from "xlsx";

const MenuActionBox = styled(Box)(({ theme }) => ({
  background: theme.colors.alpha.black[5],
  padding: theme.spacing(2),
}));

interface EnhancedTableActionsProps {
  onExport: () => void;
  onImport?: (data: any) => void;
  renderFilterForm?: React.ReactElement;
  resource: Resource;
  refreshKey: any;
}

export function EnhancedTableActions(props: EnhancedTableActionsProps) {
  const { onExport, onImport, resource, renderFilterForm, refreshKey } =
    props;

  const ref = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [isOpen, setIsOpen] = useState(false);

  const isAllowedImport = onImport
    ? usePermission({
      action: OperationAction.Create,
      resource,
    }).is_ok()
    : false;

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleImportExcel = () => {
    // onImport()
    inputRef.current?.click();
  };

  const handleChangeImportExcel = (
    evt: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (!onImport) return;
    const file = evt.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = (e) => {
      // @ts-ignore
      const data = e.target.result;
      const wb = XLSX.read(data, { type: "binary" });
      const sheetName = wb.SheetNames[0];
      const sheet = wb.Sheets[sheetName];
      const parsedData = XLSX.utils.sheet_to_json(sheet);

      onImport(parsedData);
    };
  };

  const handleExportExcel = () => {
    setIsOpen(false);
    onExport();
  };

  const handleRefreshList = () => {
    queryClient.invalidateQueries({
      queryKey: refreshKey,
    });
  };

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="baseline"
      flexDirection="row"
    >
      <Accordion sx={{ width: "100%" }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="baseline"
          flexDirection="row"
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel-filter-content"
            id="panel-filter"
            sx={{ flexGrow: 1 }}
          >
            <Typography fontSize={20}>Filter</Typography>
          </AccordionSummary>

          <IconButton
            aria-label="more actions"
            ref={ref}
            onClick={handleOpen}
          >
            <MoreVertIcon />
          </IconButton>

          <Tooltip title="Refresh table" arrow>
            <IconButton
              aria-label="refresh button"
              onClick={handleRefreshList}
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>
        <AccordionDetails>
          {renderFilterForm}
        </AccordionDetails>
      </Accordion>

      <Popover
        anchorEl={ref.current}
        onClose={handleClose}
        open={isOpen}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuActionBox display="flex">
          <List sx={{ p: 1 }} component="div">
            <ListItemButton onClick={handleExportExcel}>
              <ListItemIcon>
                <ExportIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Export" />
            </ListItemButton>

            {isAllowedImport
              ? (
                <ListItemButton onClick={handleImportExcel}>
                  <ListItemIcon>
                    <ImportIcon fontSize="small" />
                  </ListItemIcon>
                  <input
                    type="file"
                    style={{
                      display: "none",
                    }}
                    ref={inputRef}
                    accept=".xlsx, .xls"
                    onChange={handleChangeImportExcel}
                  />
                  <ListItemText primary="Import" />
                </ListItemButton>
              )
              : null}
          </List>
        </MenuActionBox>
      </Popover>
    </Box>
  );
}
