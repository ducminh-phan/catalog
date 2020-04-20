import "assets/styles/App.css";

import {
  AppBar,
  Box,
  Button,
  Container,
  Grid,
  Toolbar,
} from "@material-ui/core";
import { Link, Router } from "@reach/router";
import React, { ReactElement } from "react";

import CategoryList from "./CategoryList";
import Header from "./Header";
import ItemList from "./ItemList";

function App(): ReactElement {
  return (
    <>
      <AppBar position="static">
        <Container>
          <Toolbar>
            <Box flexGrow={1}>
              <Button color="inherit" component={Link} to="/">
                Home
              </Button>
            </Box>
            <Header />
          </Toolbar>
        </Container>
      </AppBar>
      <Box p={2}>
        <Container>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <CategoryList />
            </Grid>
            <Grid item xs={6}>
              <Router>
                <ItemList path="/categories/:categoryId" />
              </Router>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
}

export default App;
