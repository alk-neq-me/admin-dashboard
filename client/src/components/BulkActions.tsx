import { ModalFormField } from "@/context/store";
import { useStore } from "@/hooks";
import { Box, styled, Typography } from "@mui/material";
import { FormModal } from "./forms";
import { MuiButton } from "./ui";

import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";

const ButtonError = styled(MuiButton)(({ theme }) => ({
  background: theme.colors.error.main,
  color: theme.palette.error.contrastText,

  "&:hover": {
    background: theme.colors.error.dark,
  },
}));

interface BulkActionsProps {
  field: ModalFormField;
  isAllowedDelete: boolean;
  onDelete?: () => void;
}

export function BulkActions(props: BulkActionsProps) {
  const { field, isAllowedDelete, onDelete } = props;

  const { dispatch } = useStore();

  const handleOnDelete = () => {
    if (!onDelete) return;

    onDelete();
  };

  const handleClickDeleteAction = () => {
    dispatch({
      type: "OPEN_MODAL_FORM",
      payload: field,
    });
  };

  return (
    <Box display="flex" alignItems="center" justifyContent="space-between">
      <Box display="flex" alignItems="center">
        <Typography variant="h5" color="text.secondary">
          Bulk actions:
        </Typography>

        {isAllowedDelete
          ? (
            <ButtonError
              sx={{ ml: 1 }}
              startIcon={<DeleteTwoToneIcon />}
              variant="contained"
              onClick={handleClickDeleteAction}
            >
              Delete
            </ButtonError>
          )
          : null}
      </Box>

      <FormModal
        field={field}
        title="Delete seleted"
      >
        <Box display="flex" flexDirection="column" gap={1}>
          <Box>
            <Typography>Are you sure want to delete</Typography>
          </Box>
          <Box display="flex" flexDirection="row" gap={1}>
            <MuiButton
              variant="contained"
              color="error"
              onClick={handleOnDelete}
            >
              Delete
            </MuiButton>
            <MuiButton
              variant="outlined"
              onClick={() =>
                dispatch({ type: "CLOSE_ALL_MODAL_FORM" })}
            >
              Cancel
            </MuiButton>
          </Box>
        </Box>
      </FormModal>
    </Box>
  );
}
