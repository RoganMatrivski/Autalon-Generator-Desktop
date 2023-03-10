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
import TargetUiSelector from "./TargetUiSelector";
import UndoRedoButton from "./UndoRedoButton";
import SaveLoadButton from "./SaveLoadButton";
import CommandList from "./CommandList";
import { useNavigate } from "react-router-dom";

export default function Root(props: any) {
  const navigate = useNavigate();
  const { instructionList, addInstruction, clearInstruction } = useStore();

  return (
    <Container>
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
        <Button
          onClick={() => navigate("/export")}
          disabled={instructionList.length <= 0}
        >
          Export Page
        </Button>
        <Button
          onClick={() => navigate("/exportproject")}
          disabled={instructionList.length <= 0}
        >
          Export Project Page
        </Button>
      </Stack>
    </Container>
  );
}
