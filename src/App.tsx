import "bootstrap/dist/css/bootstrap.min.css";

import React, { useState } from "react";
import { Container } from "react-bootstrap";
import CommandList from "./components/CommandList";
import ResultDialog from "./components/ResultDialog";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

function App() {
  return (
    <React.Fragment>
      <DndProvider backend={HTML5Backend}>
        <Container fluid="lg">
          <CommandList />
        </Container>
      </DndProvider>
    </React.Fragment>
  );
}

export default App;
