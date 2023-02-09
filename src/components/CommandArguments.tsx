import React, { useMemo, useState } from "react";
import { DevTool } from "@hookform/devtools";

import useStore from "../store";
import { Button, Form, Modal } from "react-bootstrap";
import FunctionValue from "../structs/Class/FunctionValue";
import { ArgType } from "../structs/Interface/Argtype";
import { FunctionMetadata } from "../structs/Interface/FunctionMetadata";
import { FunctionMetadataArg } from "../structs/Interface/FunctionMetadataArg";

import { Controller, SubmitHandler, useForm } from "react-hook-form";

type CommandArgumentProps = {
  show: boolean;
  hideFn: () => void;
  commandIndex: number;
  instructionValueArgs: string[] | undefined;
  instructionMetadata: FunctionMetadata;
};

export default function CommandArguments(props: CommandArgumentProps) {
  const handleClose = () => {
    props.hideFn();
  };

  const commandID = useMemo(
    () => Math.floor(Math.random() * 10000000).toString(),
    []
  );

  const updateInstruction = useStore(state => state.updateInstruction);

  const metadataArgs = props.instructionMetadata.args;

  // Maps arguments index to key string
  const defaultArgsValue = Object.assign(
    {},
    props.instructionValueArgs === undefined ||
      props.instructionValueArgs.length == 0
      ? metadataArgs.map(x => x.defaultValue)
      : props.instructionValueArgs
  );

  const { control, handleSubmit } = useForm({
    defaultValues: defaultArgsValue,
  });

  const onSubmit: SubmitHandler<any> = data => {
    const mapped = Object.keys(data).map(k => data[k]);
    console.log(mapped);

    updateInstruction(
      props.commandIndex,
      new FunctionValue(props.instructionMetadata.name, mapped)
    );

    props.hideFn();
  };

  return (
    <Modal
      size="lg"
      show={props.show}
      backdrop="static"
      onHide={() => props.hideFn()}
    >
      <Modal.Header closeButton>
        <Modal.Title>{props.instructionMetadata.displayName}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form id={commandID} onSubmit={handleSubmit(onSubmit)}>
          {/* <DevTool control={control} /> */}
          {metadataArgs.map((x, i) => {
            let { displayName, description, argType } = x;
            // Supress warning for key string doesn't *strictly* match `${number}`
            // Even though the map function above guarantees it to be a number.
            // @ts-ignore: Type 'string' is not assignable to type '`${number}`'
            let fieldIndex: `${number}` = i.toString();
            switch (argType) {
              case ArgType.ByOption:
                return (
                  <Form.Group
                    key={displayName}
                    className="mb-3"
                    controlId={`Form${displayName}`}
                  >
                    <Form.Label>{displayName}</Form.Label>
                    <Controller
                      name={fieldIndex}
                      control={control}
                      render={({ field }) => (
                        <Form.Select {...field}>
                          <option value={"ByOption.ID"}>ID</option>
                          <option value={"ByOption.Class"}>Class</option>
                          <option value={"ByOption.Text"}>Text</option>
                          <option value={"ByOption.Name"}>Name</option>
                        </Form.Select>
                      )}
                    />
                  </Form.Group>
                );
              case ArgType.Boolean:
                return (
                  <Form.Group
                    key={displayName}
                    className="mb-3"
                    controlId="formBasicEmail"
                  >
                    <Controller
                      name={fieldIndex}
                      control={control}
                      render={({ field }) => (
                        <Form.Check
                          type="checkbox"
                          id={`default-${displayName}`}
                          label={displayName}
                          {...field}
                        />
                      )}
                    />
                  </Form.Group>
                );
              default:
                return (
                  <Form.Group
                    key={displayName}
                    className="mb-3"
                    controlId="formBasicEmail"
                  >
                    <Form.Label>{displayName}</Form.Label>
                    <Controller
                      name={fieldIndex}
                      control={control}
                      render={({ field }) => (
                        <Form.Control placeholder={description} {...field} />
                      )}
                    />
                  </Form.Group>
                );
            }
          })}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button form={commandID} variant="primary" type="submit">
          Submit
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
