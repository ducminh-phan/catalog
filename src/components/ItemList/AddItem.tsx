import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import { unwrapResult } from "@reduxjs/toolkit";
import { TextField } from "mui-rff";
import React, { ReactNode } from "react";
import { Form } from "react-final-form";
import { connect, ConnectedProps } from "react-redux";

import * as itemActions from "actions/item";
import { useNotification } from "contexts/notification";

import { FormData, required, validate } from "./schema";

const mapDispatchToProps = {
  addItem: itemActions.addItem,
};

const connector = connect(null, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {
  categoryId?: string;
};

const AddItem = (props: Props): React.ReactElement => {
  const { categoryId, addItem } = props;
  const [open, setOpen] = React.useState(false);
  const { setNotification } = useNotification();

  const handleOpen = (): void => {
    setOpen(true);
  };

  const handleClose = (): void => {
    setOpen(false);
  };

  const handleAdd = async (data: FormData): Promise<void> => {
    const resultAction = await addItem({
      categoryId,
      data,
    });

    handleClose();

    try {
      unwrapResult(resultAction);
      setNotification({
        severity: "success",
        message: "Add item successfully",
      });
    } catch (e) {
      setNotification({
        severity: "error",
        message: e.message ?? "Add item failed",
      });
    }
  };

  return (
    <>
      <Button color="inherit" onClick={handleOpen}>
        <AddIcon />
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="item-add-form-title"
        fullWidth
      >
        <DialogTitle id="item-add-form-title">Add Item</DialogTitle>
        <DialogContent>
          <Form
            onSubmit={handleAdd}
            validate={validate}
            render={({ handleSubmit, invalid }): ReactNode => (
              <form onSubmit={handleSubmit} noValidate>
                <TextField label="Name" name="name" required={required.name} />
                <TextField
                  label="Description"
                  name="description"
                  required={required.description}
                />
                <TextField
                  label="Price"
                  name="price"
                  type="number"
                  required={required.price}
                />
                <DialogActions>
                  <Button type="button" onClick={handleClose}>
                    Cancel
                  </Button>
                  <Button color="primary" type="submit" disabled={invalid}>
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

export default connector(AddItem);
