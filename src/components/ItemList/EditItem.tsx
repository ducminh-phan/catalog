import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import { makeRequired, makeValidate, TextField } from "mui-rff";
import React, { ReactNode } from "react";
import { Form } from "react-final-form";
import { connect, ConnectedProps } from "react-redux";
import * as yup from "yup";

import * as itemActions from "actions/item";
import { useNotification } from "contexts/notification";
import * as types from "utils/types";

const schema = yup.object().shape({
  name: yup.string().required(),
  description: yup.string().required(),
  price: yup.number().required(),
});

const validate = makeValidate(schema);

const required = makeRequired(schema);

type FormData = yup.InferType<typeof schema>;

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

    if (itemActions.editItem.fulfilled.match(resultAction)) {
      setNotification({
        severity: "success",
        message: "Edit item successfully",
      });
    } else if (itemActions.editItem.rejected.match(resultAction)) {
      setNotification({
        severity: "error",
        message: "Edit item failed",
      });
    }
  };

  return (
    <>
      <Button color="inherit" onClick={handleOpen}>
        <EditIcon />
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="item-edit-form-title"
        fullWidth
      >
        <DialogTitle id="item-edit-form-title">Login</DialogTitle>
        <DialogContent>
          <Form
            onSubmit={handleEdit}
            initialValues={item}
            validate={validate}
            render={({ handleSubmit, invalid, dirty }): ReactNode => (
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
