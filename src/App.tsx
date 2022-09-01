import { useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";

import CommandRow from "./components/CommandRow";
import CommandList from "./components/CommandList";
import { Card, Paper } from "@mui/material";

function App() {
  const [count, setCount] = useState(0);

  return (
    <Paper elevation={3}>
      <CommandList />
    </Paper>
  );
}

export default App;
