import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";

import CommandRow from "./components/CommandRow";
import CommandList from "./components/CommandList";
import {
  Box,
  Button,
  ButtonGroup,
  Card,
  Container,
  Grid,
  Paper,
} from "@mui/material";

import { useFilePicker } from "use-file-picker";
import { saveAs } from "file-saver";

import PropertyBox from "./components/PropertyBox";
import { useStore } from "./stores";
import ResultDialog from "./components/ResultDialog";

function App() {
  const commandList = useStore((state) => state.instructionList);
  const setCurrentRowIndex = useStore((state) => state.setCurrentRowIndex);
  const [showResultDialog, setShowResultDialog] = useState(false);

  const [openFileSelector, { filesContent, loading }] = useFilePicker({
    accept: ".json",
  });

  const handleLoadJSON = () => {
    openFileSelector();
  };

  useEffect(() => {
    if (filesContent.length == 0) return;

    useStore.setState({
      instructionList: JSON.parse(filesContent[0].content) || [],
    });

    setCurrentRowIndex(0);
  }, [filesContent]);

  const handleSaveJSON = () => {
    const str = JSON.stringify(commandList);
    const txtFile = new Blob([str], { type: "file" });

    saveAs(txtFile, "AutalonInstructionList.json");
  };

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
          <ButtonGroup variant="text" aria-label="outlined button group">
            <Button onClick={() => handleLoadJSON()}>Load</Button>
            <Button onClick={() => handleSaveJSON()}>Save</Button>
            <Button onClick={() => setShowResultDialog(true)}>Export</Button>
          </ButtonGroup>
        </Paper>
      </Container>
    </Box>
  );
}

export default App;
