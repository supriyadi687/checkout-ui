import React from 'react';
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import AppBar from "@material-ui/core/AppBar";
import Review from "./Review";
import CardDetails from "./CardDetails";


function App() {
  return (
    <div className="App">
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6" noWrap>
            Checkout
          </Typography>
        </Toolbar>
      </AppBar>
      <CardDetails />
    </div>
  );
}

export default App;
