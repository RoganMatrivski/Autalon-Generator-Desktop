import { List, ListItemText } from "@mui/material";

import {
  FormControl,
  IconButton,
  InputLabel,
  ListItem,
  ListItemButton,
  MenuItem,
  Select,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import React, { useEffect, useState } from "react";

import { FunctionValue, getFunctionList } from "../BuiltinFunctionList";

type CommandRowProps = {
  OnChange: (fnName: String) => String;
  OnSelect: (fnName: String) => String;
  OnDelete: (fnName: String) => String;
};
import CommandRow from "./CommandRow";
import { useStore } from "../stores";

export default function CommandList(props: any) {
  const commandList = useStore((state) => state.instructionList);
  const addCommand = useStore((state) => state.addInstruction);
  const removeCommand = useStore((state) => state.removeInstruction);
  const updateCommand = useStore((state) => state.updateInstruction);

  const currentRowIndex = useStore((state) => state.currentRowIndex);
  const setCurrentRowIndex = useStore((state) => state.setCurrentRowIndex);

  const handleRadioChange = (id) => setCurrentRowIndex(Number.parseInt(id));

  const handleFnChange = (idx, fn) =>
    updateCommand(idx, new FunctionValue(fn, []));

  const handleAddCommand = () =>
    addCommand(new FunctionValue("NavigateToUrl", ["http://www.google.com"]));
  const handleRemoveCommand = (idx) => removeCommand(idx);

  return (
    <List sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
      {commandList.map((x, i) => (
        <CommandRow
          key={Math.floor(Math.random() * 100000)}
          functionValue={x.name}
          OnFunctionChange={(fn) => handleFnChange(i, fn)}
          OnRadioSelect={handleRadioChange}
          OnDelete={() => handleRemoveCommand(i)}
          radioSelected={currentRowIndex == i}
          rowId={i}
        />
      ))}
      <ListItemButton
        key={Math.floor(Math.random() * 100000)}
        onClick={handleAddCommand}
      >
        <ListItemText primary="Add new command" />
      </ListItemButton>
    </List>
  );
}
