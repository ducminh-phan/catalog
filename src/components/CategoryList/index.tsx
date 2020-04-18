import { Box, List, ListItem, ListItemText } from "@material-ui/core";
import Pagination from "@material-ui/lab/Pagination";
import React, { ChangeEvent, ReactElement, useEffect, useState } from "react";
import { connect, ConnectedProps } from "react-redux";

import { fetchCategories } from "actions/category";
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

const limit = 2;

const CategoryList = (props: Props): ReactElement => {
  // eslint-disable-next-line no-shadow
  const { fetchCategories, category } = props;

  const [offset, setOffset] = useState(0);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchCategories({ offset, limit });
  }, [fetchCategories, offset]);

  const { totalCategories, categories } = category;
  const pageCount = Math.ceil(totalCategories / limit);

  const handleChangePage = (
    event: ChangeEvent<unknown>,
    value: number,
  ): void => {
    setPage(value);
    setOffset(limit * (value - 1));
  };

  return (
    <div>
      <List>
        {Object.values(categories).map((c: types.Category) => (
          <ListItem key={c.id}>
            <ListItemText primary={c.name} secondary={c.description} />
          </ListItem>
        ))}
      </List>
      <Box textAlign="center">
        <Pagination count={pageCount} page={page} onChange={handleChangePage} />
      </Box>
    </div>
  );
};

export default connector(CategoryList);
