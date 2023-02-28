import React from "react";
import {
  Button,
  ButtonGroup,
  Col,
  Container,
  Row,
  Stack,
  Table,
} from "react-bootstrap";

import useStore from "src/store";
import FunctionValue from "src/structs/Class/FunctionValue";
import GetFnListByTargetUI from "src/functions/GetFnListByTargetUI";
import ResultDialog from "./ResultDialog";
import TargetUiSelector from "./TargetUiSelector";
import UndoRedoButton from "./UndoRedoButton";
import SaveLoadButton from "./SaveLoadButton";
import ExportProjectPanel from "./ExportProjectPanel";
import CommandList from "./CommandList";
import { Link } from "react-router-dom";

export default function Root(props: any) {
  const { instructionList, addInstruction, clearInstruction } = useStore();

  const [showResultDialog, setShowResultDialog] = React.useState(false);
  return (
    <Container>
      <ResultDialog
        show={showResultDialog}
        handleClose={() => setShowResultDialog(false)}
      />
      <Stack direction="horizontal" gap={3} className="my-3">
        <UndoRedoButton />
        <div className="ms-auto" />
        <TargetUiSelector />
      </Stack>
      {<CommandList />}
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
        <>
          <SaveLoadButton />
        </>
        <Link to="/export">
          <Button>Export Page</Button>
        </Link>
        <ExportProjectPanel />
      </Stack>
    </Container>
  );
}
