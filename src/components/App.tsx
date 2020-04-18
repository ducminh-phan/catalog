import "assets/styles/App.css";

import {
  AppBar,
  Box,
  Container,
  Grid,
  Paper,
  Toolbar,
} from "@material-ui/core";
import React, { ReactElement } from "react";

import CategoryList from "./CategoryList";
import Header from "./Header";

function App(): ReactElement {
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Header />
        </Toolbar>
      </AppBar>
      <Box p={1}>
        <Container>
          <Grid container>
            <Grid item xs={4}>
              <Paper>
                <Box p={1}>
                  <CategoryList />
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
}

export default App;
