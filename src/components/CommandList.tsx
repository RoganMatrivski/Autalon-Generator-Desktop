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

import {
  FunctionValue,
  getFunctionList,
  mappedFnList,
} from "../BuiltinFunctionList";

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
  const clearCommand = useStore((state) => state.clearInstruction);

  const currentRowIndex = useStore((state) => state.currentRowIndex);
  const setCurrentRowIndex = useStore((state) => state.setCurrentRowIndex);

  const fnList = mappedFnList();

  const handleRadioChange = (id: any) =>
    setCurrentRowIndex(Number.parseInt(id));

  const handleFnChange = (idx: any, fn: any) => {
    const funcData = fnList.find((x) => x.name == fn);
    const funcArgs = funcData?.args;

    updateCommand(
      idx,
      new FunctionValue(
        fn,
        funcArgs?.map((x) => x.defaultValue)
      )
    );
  };

  const handleAddCommand = () =>
    addCommand(
      new FunctionValue(
        fnList[0].name,
        fnList[0].args.map((x) => x.defaultValue)
      )
    );
  const handleRemoveCommand = (idx: any) => removeCommand(idx);

  const [targetUI, SetTargetUI] = useState("Ext");
  const handleTargetUIChange = (event: any) => {
    SetTargetUI(event.target.value);

    clearCommand();
  };

  return (
    <Box sx={{ height: "80vh", overflowY: "auto" }}>
      <FormControl
        variant="standard"
        sx={{ m: 1, minWidth: 120, width: 0.6, mx: 10 }}
      >
        <InputLabel id="demo-simple-select-standard-label">
          UI Framework
        </InputLabel>
        <Select
          labelId="demo-simple-select-standard-label"
          id="demo-simple-select-standard"
          value={targetUI}
          onChange={handleTargetUIChange}
          label="Command"
        >
          {["Ext", "MUI"].map((x) => (
            <MenuItem value={x}>{x}</MenuItem>
          ))}
        </Select>
      </FormControl>
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
            targetUI={targetUI}
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
