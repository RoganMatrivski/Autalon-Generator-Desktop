import { Table } from "react-bootstrap";
import Command from "./Command";

import useStore from "src/store";

export default function CommandList() {
  const { instructionList, addInstruction, clearInstruction } = useStore();
  return (
    <Table size="sm" bordered>
      <thead>
        <tr>
          <th>Instruction</th>
          <th>Arguments</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {instructionList.map((x, i) => (
          <Command
            key={`${i}_${x.name}_Command`}
            commandIndex={i}
            functionValue={x}
          />
        ))}
      </tbody>
    </Table>
  );
}
