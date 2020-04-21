import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import { unwrapResult } from "@reduxjs/toolkit";
import React from "react";
import { connect, ConnectedProps } from "react-redux";

import * as itemActions from "actions/item";
import { useNotification } from "contexts/notification";

const mapDispatchToProps = {
  deleteItem: itemActions.deleteItem,
};

const connector = connect(null, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {
  categoryId?: string;
  itemId: string;
};

const DeleteItem = (props: Props): React.ReactElement => {
  const { categoryId, itemId, deleteItem } = props;
  const [open, setOpen] = React.useState(false);
  const { setNotification } = useNotification();

  const handleOpen = (): void => {
    setOpen(true);
  };

  const handleClose = (): void => {
    setOpen(false);
  };

  const handleDelete = async (): Promise<void> => {
    const resultAction = await deleteItem({
      categoryId,
      itemId,
    });

    handleClose();

    try {
      unwrapResult(resultAction);
      setNotification({
        severity: "success",
        message: "Delete item successfully",
      });
    } catch (e) {
      setNotification({
        severity: "error",
        message: e.message ?? "Delete item failed",
      });
    }
  };

  return (
    <>
      <Button data-testid="delete-item" color="inherit" onClick={handleOpen}>
        <DeleteIcon />
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="item-delete-form-title"
        fullWidth
      >
        <DialogTitle id="item-delete-form-title">Delete Item</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure to delete this item?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button type="button" onClick={handleClose}>
            Cancel
          </Button>
          <Button color="primary" type="submit" onClick={handleDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default connector(DeleteItem);
