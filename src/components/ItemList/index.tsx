import {
  Box,
  Button,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Paper,
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import Pagination from "@material-ui/lab/Pagination";
import { RouteComponentProps } from "@reach/router";
import React, { ChangeEvent, ReactElement, useEffect, useState } from "react";
import { connect, ConnectedProps } from "react-redux";

import { fetchItems } from "actions/item";
import { useAuth } from "contexts/auth";
import { RootState } from "reducers";
import * as types from "utils/types";

interface ItemListProps extends RouteComponentProps {
  categoryId?: string;
}

const mapDispatchToProps = {
  fetchItems,
};

const connector = connect(
  ({ item }: RootState) => ({ item }),
  mapDispatchToProps,
);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & ItemListProps;

const limit = 2;

const ItemList = (props: Props): ReactElement => {
  // eslint-disable-next-line no-shadow
  const { fetchItems, item, categoryId } = props;

  const { data } = useAuth();
  const [offset, setOffset] = useState(0);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchItems({ categoryId, offset, limit });
  }, [fetchItems, categoryId, offset]);

  const { totalItems, items } = item;
  const pageCount = Math.ceil(totalItems / limit);

  const handleChangePage = (
    event: ChangeEvent<unknown>,
    value: number,
  ): void => {
    setPage(value);
    setOffset(limit * (value - 1));
  };

  return (
    <Paper>
      <Box p={2}>
        <List>
          {Object.values(items).map((c: types.Item) => (
            <ListItem key={c.id}>
              <ListItemText primary={c.name} secondary={c.description} />
              {data?.user.id === c.userId ? (
                <div />
              ) : (
                <ListItemSecondaryAction>
                  <Button>
                    <EditIcon />
                  </Button>
                </ListItemSecondaryAction>
              )}
            </ListItem>
          ))}
        </List>
        <Pagination count={pageCount} page={page} onChange={handleChangePage} />
      </Box>
    </Paper>
  );
};

export default connector(ItemList);
