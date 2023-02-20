import React, { useState } from "react";
import {
  Button,
  Form,
  ListGroup,
  Modal,
  ToggleButton,
  ToggleButtonGroup,
} from "react-bootstrap";
import GetFnListByTargetUI from "src/functions/GetFnListByTargetUI";
import mappedFnList from "src/functions/mappedFnList";
import useStore from "src/store";
import FunctionValue from "src/structs/Class/FunctionValue";
import CommandPickerDetailed from "./CommandPickerDetailed";
import CommandPickerSimple from "./CommandPickerSimple";

type CommandPickerPanelProps = {
  show: boolean;
  hideFn: () => void;
  commandIndex: number;
  fnName?: string;
};

enum DialogType {
  Simple,
  Detailed,
}

export default function CommandPickerPanel(props: CommandPickerPanelProps) {
  const { updateInstruction, removeNullInstructions } = useStore();

  const [filterText, setFilterText] = useState("");
  const [dialogMode, setDialogMode] = useState(DialogType.Simple);

  const { show, hideFn, commandIndex, fnName } = props;

  const handleClose = () => {
    hideFn();
  };

  const handleModalExit = () => {
    removeNullInstructions();
  };

  let dialog = null;
  let size: "lg" | "xl" = "lg";

  switch (dialogMode) {
    case DialogType.Simple:
      dialog = (
        <CommandPickerSimple
          show={show}
          hideFn={handleClose}
          commandIndex={commandIndex}
          fnName={fnName}
        />
      );
      size = "lg";
      break;
    case DialogType.Detailed:
      dialog = (
        <CommandPickerDetailed
          show={show}
          hideFn={handleClose}
          commandIndex={commandIndex}
          fnName={fnName}
        />
      );
      size = "xl";
      break;
  }

  return (
    <Modal
      size={size}
      show={props.show}
      backdrop="static"
      scrollable
      onHide={handleClose}
      onExited={handleModalExit}
    >
      <Modal.Header>
        <Modal.Title>Command Picker</Modal.Title>
        <ToggleButtonGroup
          type="radio"
          name="options"
          value={dialogMode}
          onChange={value => setDialogMode(value)}
        >
          <ToggleButton
            id={`${commandIndex}_DialogTypeToggle_Simple`}
            value={DialogType.Simple}
          >
            Simple
          </ToggleButton>
          <ToggleButton
            id={`${commandIndex}_DialogTypeToggle_Detailed`}
            value={DialogType.Detailed}
            variant="warning"
          >
            Detailed
          </ToggleButton>
        </ToggleButtonGroup>
      </Modal.Header>
      {dialog}
    </Modal>
  );
}
