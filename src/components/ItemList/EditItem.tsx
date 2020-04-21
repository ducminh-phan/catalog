import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import { unwrapResult } from "@reduxjs/toolkit";
import { TextField } from "mui-rff";
import React, { ReactNode } from "react";
import { Form } from "react-final-form";
import { connect, ConnectedProps } from "react-redux";

import * as itemActions from "actions/item";
import { useNotification } from "contexts/notification";
import * as types from "utils/types";

import { FormData, required, validate } from "./schema";

const mapDispatchToProps = {
  editItem: itemActions.editItem,
};

const connector = connect(null, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {
  categoryId?: string;
  item: types.Item;
};

const EditItem = (props: Props): React.ReactElement => {
  const { categoryId, editItem, item } = props;
  const [open, setOpen] = React.useState(false);
  const { setNotification } = useNotification();

  const handleOpen = (): void => {
    setOpen(true);
  };

  const handleClose = (): void => {
    setOpen(false);
  };

  const handleEdit = async (data: FormData): Promise<void> => {
    const resultAction = await editItem({
      categoryId,
      itemId: item.id.toString(),
      data,
    });

    handleClose();

    try {
      unwrapResult(resultAction);
      setNotification({
        severity: "success",
        message: "Edit item successfully",
      });
    } catch (e) {
      setNotification({
        severity: "error",
        message: e.message ?? "Edit item failed",
      });
    }
  };

  return (
    <>
      <Button data-testid="edit-item" color="inherit" onClick={handleOpen}>
        <EditIcon />
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="item-edit-form-title"
        fullWidth
      >
        <DialogTitle id="item-edit-form-title">Edit Item</DialogTitle>
        <DialogContent>
          <Form
            onSubmit={handleEdit}
            initialValues={item}
            validate={validate}
            render={({ handleSubmit, invalid, dirty }): ReactNode => (
              <form onSubmit={handleSubmit} noValidate>
                <TextField
                  id="edit-item-name"
                  label="Name"
                  name="name"
                  required={required.name}
                />
                <TextField
                  id="edit-item-description"
                  label="Description"
                  name="description"
                  required={required.description}
                />
                <TextField
                  id="edit-item-price"
                  label="Price"
                  name="price"
                  type="number"
                  required={required.price}
                />
                <DialogActions>
                  <Button type="button" onClick={handleClose}>
                    Cancel
                  </Button>
                  <Button
                    color="primary"
                    type="submit"
                    disabled={invalid || !dirty}
                  >
                    Submit
                  </Button>
                </DialogActions>
              </form>
            )}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default connector(EditItem);
