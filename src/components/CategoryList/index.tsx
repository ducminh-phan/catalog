import {
  Box,
  Button,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Paper,
} from "@material-ui/core";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
import Pagination from "@material-ui/lab/Pagination";
import { Link } from "@reach/router";
import React, { ChangeEvent, ReactElement, useEffect, useState } from "react";
import { connect, ConnectedProps } from "react-redux";

import { fetchCategories } from "actions/category";
import { useAuth } from "contexts/auth";
import { CATEGORIES_PER_PAGE } from "enums";
import { RootState } from "reducers";

import AddCategory from "./AddCategory";

const mapDispatchToProps = {
  fetchCategories,
};

const connector = connect(
  ({ category }: RootState) => ({ category }),
  mapDispatchToProps,
);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux;

const CategoryList = (props: Props): ReactElement => {
  // eslint-disable-next-line no-shadow
  const { fetchCategories, category } = props;

  const { data } = useAuth();
  const [offset, setOffset] = useState(0);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchCategories({ offset, limit: CATEGORIES_PER_PAGE });
  }, [fetchCategories, offset]);

  const { totalCategories, categories, ids } = category;
  const pageCount = Math.ceil(totalCategories / CATEGORIES_PER_PAGE);

  const handleChangePage = (
    event: ChangeEvent<unknown>,
    value: number,
  ): void => {
    setPage(value);
    setOffset(CATEGORIES_PER_PAGE * (value - 1));
  };

  return (
    <Paper>
      <Box p={1}>
        <List>
          {ids
            .map((id) => categories[id])
            .map((c) => (
              <ListItem key={c.id}>
                <ListItemText primary={c.name} secondary={c.description} />
                <ListItemSecondaryAction>
                  <Button component={Link} to={`/categories/${c.id}`}>
                    <ArrowRightIcon />
                  </Button>
                </ListItemSecondaryAction>
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
              {data === null ? <div /> : <AddCategory />}
            </ListItemSecondaryAction>
          </ListItem>
        </List>
      </Box>
    </Paper>
  );
};

export default connector(CategoryList);
