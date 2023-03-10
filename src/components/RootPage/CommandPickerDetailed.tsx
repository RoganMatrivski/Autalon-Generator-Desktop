import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Button,
  Col,
  Form,
  InputGroup,
  ListGroup,
  Modal,
  Row,
  Stack,
} from "react-bootstrap";
import GetFnListByTargetUI from "src/functions/GetFnListByTargetUI";
import mappedFnListGet from "src/functions/mappedFnList";
import useStore from "src/store";
import FunctionValue from "src/structs/Class/FunctionValue";

import usePromise from "react-promise-suspense";

type CommandPickerDetailedProps = {
  show: boolean;
  hideFn: () => void;
  commandIndex: number;
  fnName?: string;
};

export default function CommandPickerDetailed(
  props: CommandPickerDetailedProps
) {
  const { targetUI, updateInstruction } = useStore();

  const [filterText, setFilterText] = useState("");
  const [selectedInstruction, setSelectedInstruction] = useState<string | null>(
    props.fnName || null
  );

  const mappedFnList = usePromise(mappedFnListGet, []);

  const handleClose = () => {
    props.hideFn();
  };

  const fnMetadata = useMemo(() => {
    if (selectedInstruction === null) {
      return null;
    }

    return mappedFnList.find(x => x.name == selectedInstruction);
  }, [selectedInstruction]);

  // Fetches command list and removes duplicate
  const commandList = GetFnListByTargetUI(mappedFnList, targetUI).filter(
    (value, index, self) => index === self.findIndex(t => t[0] === value[0])
  );

  function selectInstruction(fnNameDisplayName: string[]) {
    setSelectedInstruction(fnNameDisplayName[0]);
  }

  function getFnMetadata(name: string) {
    return mappedFnList.find(x => x.name == name);
  }

  function handleUpdateInstruction() {
    const fnName = selectedInstruction;

    const defaultArgsFromFnName = mappedFnList
      .find(x => x.name == fnName)
      ?.args?.map(x => x.defaultValue);

    if (defaultArgsFromFnName === undefined) {
      throw "Cannot find function with name " + name;
    }

    updateInstruction(
      props.commandIndex,
      new FunctionValue(fnName, defaultArgsFromFnName)
    );

    handleClose();
  }

  return (
    <React.Fragment>
      <Modal.Body>
        <Row>
          <Col>
            <div className="mb-4 mx-2 w-auto">
              <InputGroup className="w-100">
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
            </div>
            <ListGroup
              className=" px-2 overflow-auto"
              style={{ height: "50vh" }}
            >
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
                      key={`${props.commandIndex}_${x[0]}`}
                      action
                      onClick={() => selectInstruction(x)}
                      active={x[0] == selectedInstruction}
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
          </Col>
          <Col>
            <Row>
              <Col>
                <p className="h2">{fnMetadata?.displayName}</p>
              </Col>
            </Row>
            <Row>
              <Col>
                <p className="lead">{fnMetadata?.description}</p>
              </Col>
            </Row>
            {(fnMetadata?.args || []).length > 0 && (
              <Row>
                <Col>
                  <p className="h5">Arguments</p>
                </Col>
              </Row>
            )}
            {fnMetadata?.args.map(arg => (
              <Row key={`CommandArgumentsArgs_${arg.displayName}`}>
                <Col md={4}>
                  <p className="mb-0">
                    <strong>{arg.displayName}</strong>
                  </p>
                </Col>
                <Col>
                  <p className="mb-0">{arg.description}</p>
                </Col>
              </Row>
            ))}
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button
          variant="primary"
          disabled={
            !selectedInstruction ||
            (props.fnName != null && selectedInstruction == props.fnName)
          }
          onClick={handleUpdateInstruction}
        >
          Select
        </Button>
      </Modal.Footer>
    </React.Fragment>
  );
}
