import { List } from "@mui/material";
import CommandRow from "./CommandRow";

export default function CommandList(props: any) {
  return (
    <List sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
      <CommandRow />
      <CommandRow />
      <CommandRow />
      <CommandRow />
      <CommandRow />
    </List>
  );
}
