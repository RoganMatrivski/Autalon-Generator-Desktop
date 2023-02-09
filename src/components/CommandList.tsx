import React from "react";
import { Button, ButtonGroup, Col, Row, Stack, Table } from "react-bootstrap";
import Command from "./Command";

import useStore from "../store";
import FunctionValue from "../structs/Class/FunctionValue";
import GetFnListByTargetUI from "../functions/GetFnListByTargetUI";
import ResultDialog from "./ResultDialog";
import TargetUiSelector from "./TargetUiSelector";

export default function CommandList(props: any) {
  const instructionList = useStore(state => state.instructionList);
  const addInstruction = useStore(state => state.addInstruction);
  const clearInstruction = useStore(state => state.clearInstruction);

  const [showResultDialog, setShowResultDialog] = React.useState(false);

  const fnList = GetFnListByTargetUI();
  return (
    <React.Fragment>
      <ResultDialog
        show={showResultDialog}
        handleClose={() => setShowResultDialog(false)}
      />
      <Stack direction="horizontal" gap={3} className="my-3">
        <div className="ms-auto" />
        <TargetUiSelector />
      </Stack>
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
      <Stack direction="horizontal" gap={3}>
        <ButtonGroup>
          <Button
            onClick={() => {
              addInstruction(new FunctionValue(null, []));
            }}
          >
            Add
          </Button>
          <Button
            variant="danger"
            disabled={instructionList.length <= 0}
            onClick={() => {
              clearInstruction();
            }}
          >
            Clear
          </Button>
        </ButtonGroup>
        <ButtonGroup>
          <Button>Save</Button>
          <Button>Load</Button>
        </ButtonGroup>
        <Button
          disabled={instructionList.length <= 0}
          onClick={() => {
            setShowResultDialog(true);
          }}
        >
          Export
        </Button>
      </Stack>
    </React.Fragment>
  );
}
