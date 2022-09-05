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
import { Box } from "@mui/system";

export default function CommandList(props: any) {
  const commandList = useStore((state) => state.instructionList);
  const addCommand = useStore((state) => state.addInstruction);
  const removeCommand = useStore((state) => state.removeInstruction);
  const updateCommand = useStore((state) => state.updateInstruction);

  const currentRowIndex = useStore((state) => state.currentRowIndex);
  const setCurrentRowIndex = useStore((state) => state.setCurrentRowIndex);

  const handleRadioChange = (id: any) =>
    setCurrentRowIndex(Number.parseInt(id));

  const handleFnChange = (idx: any, fn: any) =>
    updateCommand(idx, new FunctionValue(fn, []));

  const handleAddCommand = () =>
    addCommand(new FunctionValue("NavigateToUrl", ["http://www.google.com"]));
  const handleRemoveCommand = (idx: any) => removeCommand(idx);

  return (
    <Box sx={{ height: "80vh", overflowY: "auto" }}>
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
    </Box>
  );
}
