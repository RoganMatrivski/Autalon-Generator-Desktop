import React, { useState } from "react";
import { Button, Form, InputGroup, ListGroup, Modal } from "react-bootstrap";
import GetFnListByTargetUI from "src/functions/GetFnListByTargetUI";
import mappedFnList from "src/functions/mappedFnList";
import useStore from "src/store";
import FunctionValue from "src/structs/Class/FunctionValue";
import { ArgType } from "src/structs/Interface/Argtype";

import usePromise from "react-promise-suspense";
import mappedFnListGet from "src/functions/mappedFnList";

type CommandPickerSimpleProps = {
  show: boolean;
  hideFn: () => void;
  commandIndex: number;
  fnName?: string;
};

export default function CommandPickerSimple(props: CommandPickerSimpleProps) {
  const { updateInstruction, targetUI } = useStore();

  const [filterText, setFilterText] = useState("");
  const handleClose = () => {
    props.hideFn();
  };

  const mappedFnList = usePromise(mappedFnListGet, []);

  // Fetches command list and removes duplicate
  // TODO: Add selective target UI
  const commandList = GetFnListByTargetUI(mappedFnList, targetUI).filter(
    (value, index, self) => index === self.findIndex(t => t[0] === value[0])
  );

  function getFnMetadata(name: string) {
    return mappedFnList.find(x => x.name == name);
  }

  function handleUpdateInstruction(fnNameDisplayName: string[]) {
    const [name, displayName] = fnNameDisplayName;
    const defaultArgsFromFnName = mappedFnList
      .find(x => x.name == name)
      ?.args?.map(x => x.defaultValue);

    if (defaultArgsFromFnName === undefined) {
      throw "Cannot find function with name " + name;
    }

    updateInstruction(
      props.commandIndex,
      new FunctionValue(fnNameDisplayName[0], defaultArgsFromFnName)
    );

    handleClose();
  }

  return (
    <React.Fragment>
      <Modal.Body>
        <div className="px-2">
          <InputGroup className="w-100 mb-4">
            <Form.Control
              autoFocus
              placeholder="Type to filter..."
              onChange={e => setFilterText(e.target.value)}
              value={filterText}
            />
            {filterText && (
              <Button
                variant="outline-danger"
                onClick={() => setFilterText("")}
              >
                X
              </Button>
            )}
          </InputGroup>
          <ListGroup className="overflow-auto pe-2" style={{ height: "50vh" }}>
            {commandList
              .filter(
                x =>
                  !filterText ||
                  x[1].toLowerCase().includes(filterText.toLowerCase())
              )
              .map(x => {
                const [name, displayName] = x;
                const args = getFnMetadata(name)?.args;
                const argsLength = args?.length || 0;
                return (
                  <ListGroup.Item
                    key={`${props.commandIndex}_${name}`}
                    action
                    onClick={() => handleUpdateInstruction(x)}
                  >
                    <div className="d-inline-flex">
                      <p className="mb-0">{displayName}</p>
                      {argsLength > 0 && (
                        <>
                          <p className="mb-0 mx-2">-</p>
                          <p className="mb-0 text-black-50">
                            {args?.map(x => x.displayName).join(", ")}
                          </p>
                        </>
                      )}
                    </div>
                  </ListGroup.Item>
                );
              })}
          </ListGroup>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </React.Fragment>
  );
}
