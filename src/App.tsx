import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";

import CommandRow from "./components/CommandRow";
import CommandList from "./components/CommandList";
import { Box, Button, Card, Container, Grid, Paper } from "@mui/material";
import PropertyBox from "./components/PropertyBox";
import { useStore } from "./stores";
import ResultDialog from "./components/ResultDialog";

function App() {
  const commandList = useStore((state) => state.instructionList);
  const [showResultDialog, setShowResultDialog] = useState(false);

  const [count, setCount] = useState(0);

  return (
    <Box sx={{ height: "80vh" }}>
      <ResultDialog
        open={showResultDialog}
        handleClose={() => setShowResultDialog(false)}
      />
      <Container maxWidth="lg">
        <Paper elevation={3}>
          <Grid container>
            <Grid item xs={4}>
              <CommandList />
            </Grid>
            <Grid item xs={8}>
              <PropertyBox />
              {/* {commandList.length > 0 ? <PropertyBox /> : <></>} */}
            </Grid>
          </Grid>
          <Button
            onClick={() =>
              useStore.setState({
                instructionList: JSON.parse(prompt("JSON String Here")!) || [],
              })
            }
          >
            Load
          </Button>
          <Button onClick={() => setShowResultDialog(true)}>Save</Button>
        </Paper>
      </Container>
    </Box>
  );
}

export default App;
