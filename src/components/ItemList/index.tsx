import {
  Box,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Paper,
} from "@material-ui/core";
import Pagination from "@material-ui/lab/Pagination";
import { RouteComponentProps } from "@reach/router";
import React, { ChangeEvent, ReactElement, useEffect, useState } from "react";
import { connect, ConnectedProps } from "react-redux";

import { fetchItems } from "actions/item";
import { useAuth } from "contexts/auth";
import { ITEMS_PER_PAGE } from "enums";
import { RootState } from "reducers";

import AddItem from "./AddItem";
import EditItem from "./EditItem";

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

const ItemList = (props: Props): ReactElement => {
  // eslint-disable-next-line no-shadow
  const { fetchItems, item, categoryId } = props;

  const { data } = useAuth();
  const [offset, setOffset] = useState(0);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchItems({ categoryId, offset, limit: ITEMS_PER_PAGE });
  }, [fetchItems, categoryId, offset]);

  const { totalItems, items, ids } = item;
  const pageCount = Math.ceil(totalItems / ITEMS_PER_PAGE);

  const handleChangePage = (
    event: ChangeEvent<unknown>,
    value: number,
  ): void => {
    setPage(value);
    setOffset(ITEMS_PER_PAGE * (value - 1));
  };

  return (
    <Paper>
      <Box p={1}>
        <List>
          {ids
            .map((id) => items[id])
            .map((c) => (
              <ListItem key={c.id}>
                <ListItemText primary={c.name} secondary={c.description} />
                {data?.user.id === c.userId ? (
                  <ListItemSecondaryAction>
                    <EditItem categoryId={categoryId} item={c} />
                  </ListItemSecondaryAction>
                ) : (
                  <div />
                )}
              </ListItem>
            ))}
        </List>
        <List>
          <ListItem>
            <Pagination
              count={pageCount}
              page={page}
              onChange={handleChangePage}
            />
            <ListItemSecondaryAction>
              {data === null ? <div /> : <AddItem categoryId={categoryId} />}
            </ListItemSecondaryAction>
          </ListItem>
        </List>
      </Box>
    </Paper>
  );
};

export default connector(ItemList);
