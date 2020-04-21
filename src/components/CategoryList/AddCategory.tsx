import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import { unwrapResult } from "@reduxjs/toolkit";
import { makeRequired, makeValidate, TextField } from "mui-rff";
import React, { ReactNode } from "react";
import { Form } from "react-final-form";
import { connect, ConnectedProps } from "react-redux";
import * as yup from "yup";

import { addCategory } from "actions/category";
import { useNotification } from "contexts/notification";

const schema = yup.object().shape({
  name: yup.string().required().min(5),
  description: yup.string().required(),
});

const validate = makeValidate(schema);

const required = makeRequired(schema);

type FormData = yup.InferType<typeof schema>;

const mapDispatchToProps = {
  addCategory,
};

const connector = connect(null, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux;

const AddCategory = (props: Props): React.ReactElement => {
  // eslint-disable-next-line no-shadow
  const { addCategory } = props;
  const [open, setOpen] = React.useState(false);
  const { setNotification } = useNotification();

  const handleOpen = (): void => {
    setOpen(true);
  };

  const handleClose = (): void => {
    setOpen(false);
  };

  const handleAdd = async (data: FormData): Promise<void> => {
    const resultAction = await addCategory(data);

    handleClose();

    try {
      unwrapResult(resultAction);
      setNotification({
        severity: "success",
        message: "Add category successfully",
      });
    } catch (e) {
      setNotification({
        severity: "error",
        message: e.message ?? "Add category failed",
      });
    }
  };

  return (
    <>
      <Button data-testid="add-category" color="inherit" onClick={handleOpen}>
        <AddIcon />
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="category-add-form-title"
        fullWidth
      >
        <DialogTitle id="category-add-form-title">Add Category</DialogTitle>
        <DialogContent>
          <Form
            onSubmit={handleAdd}
            validate={validate}
            render={({ handleSubmit, invalid }): ReactNode => (
              <form onSubmit={handleSubmit} noValidate>
                <TextField
                  id="add-category-name"
                  label="Name"
                  name="name"
                  required={required.name}
                />
                <TextField
                  id="add-category-description"
                  label="Description"
                  name="description"
                  required={required.description}
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

export default connector(AddCategory);
