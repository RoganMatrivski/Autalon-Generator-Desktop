import { BsArrowDown, BsArrowUp, BsTrash, BsPencil } from "react-icons/bs";
import { Button, ButtonGroup } from "react-bootstrap";
import React, { useEffect, useState } from "react";

import GetArgsDisplayText from "../functions/GetArgsDisplayText";
import mappedFnList from "../functions/mappedFnList";

import FunctionValue from "../structs/Class/FunctionValue";

import CommandPickerPanel from "./CommandPickerPanel";
import ConfirmationButton from "./ConfirmationButton";
import CommandArguments from "./CommandArguments";

import useStore from "../store";

type CommandArgs = {
  commandIndex: number;
  functionValue: FunctionValue;
};

export default function Command(props: CommandArgs) {
  // Zustand store init
  const instructionList = useStore(state => state.instructionList);
  const moveInstruction = useStore(state => state.moveInstruction);
  const removeInstruction = useStore(state => state.removeInstruction);

  // Use state hooks
  const [showArgumentWindow, setShowArgumentWindow] = useState(false);
  const [showCommandPickerSimpleWindow, setShowCommandPickerSimpleWindow] =
    useState(false);

  // Use effect hooks
  useEffect(() => {
    if (props.functionValue.name == null) {
      setShowCommandPickerSimpleWindow(true);
    }
  }, [props.functionValue]);

  // Other calculations
  let { name: fnName, argValue } = props.functionValue;
  let metadata = mappedFnList().find(x => x.name == fnName);

  // On modal close event
  function onModalClose() {
    setShowCommandPickerSimpleWindow(false);
  }

  if (metadata == null) {
    return (
      <React.Fragment>
        <CommandPickerPanel
          show={showCommandPickerSimpleWindow}
          hideFn={onModalClose}
          commandIndex={props.commandIndex}
        />
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <CommandArguments
        show={showArgumentWindow}
        hideFn={() => setShowArgumentWindow(false)}
        commandIndex={props.commandIndex}
        instructionMetadata={metadata}
        instructionValueArgs={argValue}
      />
      <CommandPickerPanel
        show={showCommandPickerSimpleWindow}
        hideFn={() => setShowCommandPickerSimpleWindow(false)}
        commandIndex={props.commandIndex}
        fnName={fnName || undefined}
      />
      <tr>
        <td>
          <div className="d-flex align-items-center">
            <p className="mb-0 flex-fill">{metadata.displayName}</p>
            <Button onClick={() => setShowCommandPickerSimpleWindow(true)}>
              <BsPencil />
            </Button>
          </div>
        </td>
        <td>
          <div className="d-flex align-items-center">
            {metadata.args.length > 0 ? (
              <>
                <span className="flex-fill">
                  {GetArgsDisplayText(argValue, metadata).join(", ")}
                </span>
                <Button onClick={() => setShowArgumentWindow(true)}>
                  <BsPencil />
                </Button>
              </>
            ) : (
              <span className="text-black-50">No arguments</span>
            )}
          </div>
        </td>
        <td style={{ whiteSpace: "nowrap", width: "1%" }}>
          <ButtonGroup>
            <Button
              disabled={props.commandIndex == 0}
              onClick={() => moveInstruction(props.commandIndex, -1)}
            >
              <BsArrowUp />
            </Button>
            <Button
              disabled={props.commandIndex == instructionList.length - 1}
              onClick={() => moveInstruction(props.commandIndex, 1)}
            >
              <BsArrowDown />
            </Button>
            {/* <ConfirmationButton
              variant="danger"
              onConfirm={() => removeInstruction(props.commandIndex)}
              preConfirmRender={<BsTrash />}
              postConfirmRender={"Are you sure?"}
            /> */}
            <Button
              variant="danger"
              onClick={() => removeInstruction(props.commandIndex)}
            >
              <BsTrash />
            </Button>
          </ButtonGroup>
        </td>
      </tr>
    </React.Fragment>
  );
}
