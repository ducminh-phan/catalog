import {
  Button,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
} from "@material-ui/core";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
import Pagination from "@material-ui/lab/Pagination";
import { Link } from "@reach/router";
import React, { ChangeEvent, ReactElement, useEffect, useState } from "react";
import { connect, ConnectedProps } from "react-redux";

import { fetchCategories } from "actions/category";
import { CATEGORIES_PER_PAGE } from "enums";
import { RootState } from "reducers";
import * as types from "utils/types";

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

  const [offset, setOffset] = useState(0);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchCategories({ offset, limit: CATEGORIES_PER_PAGE });
  }, [fetchCategories, offset]);

  const { totalCategories, categories } = category;
  const pageCount = Math.ceil(totalCategories / CATEGORIES_PER_PAGE);

  const handleChangePage = (
    event: ChangeEvent<unknown>,
    value: number,
  ): void => {
    setPage(value);
    setOffset(CATEGORIES_PER_PAGE * (value - 1));
  };

  return (
    <div>
      <List>
        {Object.values(categories).map((c: types.Category) => (
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
      <Pagination count={pageCount} page={page} onChange={handleChangePage} />
    </div>
  );
};

export default connector(CategoryList);
