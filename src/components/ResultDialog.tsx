import { Button, Modal, Stack } from "react-bootstrap";
import { useEffect, useMemo } from "react";

import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import groovy from "react-syntax-highlighter/dist/esm/languages/hljs/groovy";
import a11yLight from "react-syntax-highlighter/dist/esm/styles/hljs/a11y-light";

SyntaxHighlighter.registerLanguage("javascript", groovy);
import Ansi from "ansi-to-react";
import stripAnsi from "strip-ansi";

import { CopyToClipboard } from "react-copy-to-clipboard";

import useStore from "../store";

import { transpile_groovy } from "@RoganMatrivski/autalon-transpiler";

import mappedFnList from "../functions/mappedFnList";
import { ArgType } from "../structs/Interface/Argtype";
import FunctionValue from "../structs/Class/FunctionValue";

type ResultDialogProps = {
  show: boolean;
  handleClose: () => void;
};

export default function ResultDialog(props: ResultDialogProps) {
  const { show, handleClose } = props;

  const instructionList = useStore(
    (state: { instructionList: any }) => state.instructionList
  );

  const [scriptResult, errorString]: [string, null] | [null, string] =
    useMemo(() => {
      if (!show) return ["", null];

      const functionStrings: Array<string> = instructionList.map(
        (x: FunctionValue) => {
          const { name, argValue } = x;
          const argsMetadata = mappedFnList().find(y => y.name == name)?.args!;

          function PreprocessArgValue(value: string, index: number) {
            const argsType = argsMetadata[index].argType;

            if (argsType == ArgType.String) return `"${value}"`;

            return value;
          }

          const preProcessedValue = argValue.map(PreprocessArgValue);
          const joinedPreProcessedValue = preProcessedValue.join(", ");
          return `#:${name}(${joinedPreProcessedValue});`;
        }
      );

      const joinedFunctionStrings = functionStrings.join("\n");
      const processedInstructionList = `#[version=1]\n\n${joinedFunctionStrings}`;

      try {
        const convertedCode = transpile_groovy(processedInstructionList);
        return [convertedCode, null];
      } catch (err: any) {
        return [null, err.toString()];
      }
    }, [show, instructionList]);

  return (
    <Modal scrollable size="xl" show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Result</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {scriptResult != null ? (
          <SyntaxHighlighter language="groovy" style={a11yLight}>
            {"// Import stuffs\n\n" +
              scriptResult
                .split("\n")
                .filter(
                  str =>
                    !(str.startsWith("import ") || str.startsWith("package "))
                )
                .join("\n")}
          </SyntaxHighlighter>
        ) : (
          <>
            <p>Error encountered!</p>
            <pre>
              <code style={{ whiteSpace: "pre-wrap" }}>
                <Ansi>{errorString}</Ansi>
              </code>
            </pre>
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Stack direction="horizontal" gap={3}>
          <CopyToClipboard
            text={scriptResult || stripAnsi(errorString || "")}
            onCopy={() => alert("Copied")}
          >
            <Button>Copy to Clipboard</Button>
          </CopyToClipboard>
          <Button variant="secondary" onClick={props.handleClose}>
            Close
          </Button>
        </Stack>
      </Modal.Footer>
    </Modal>
  );
}
