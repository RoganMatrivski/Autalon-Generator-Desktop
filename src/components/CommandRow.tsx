import {
  FormControl,
  InputLabel,
  ListItem,
  MenuItem,
  Select,
} from "@mui/material";
import React from "react";

import FnList from "../BuiltinFunctionList";

type CommandRowProps = {
  OnChange: (fn: FnList) => FnList;
};

export default function CommandRow(prop: CommandRowProps) {
  const [operation, setOperation] = React.useState(FnList.ClickElementByText);

  const handleChange = (event: any) => {
    console.log(event.target.value);
    setOperation(event.target.value);
  };

  return (
    <ListItem>
      <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="demo-simple-select-standard-label">Age</InputLabel>
        <Select
          labelId="demo-simple-select-standard-label"
          id="demo-simple-select-standard"
          value={operation}
          onChange={handleChange}
          label="Agea"
        >
          {Object.keys(FnList)
            .filter((key: any) => !isNaN(Number(FnList[key])))
            .map((x) => (
              <MenuItem value={x}>{x}</MenuItem>
            ))}
        </Select>
      </FormControl>
    </ListItem>
  );
}
