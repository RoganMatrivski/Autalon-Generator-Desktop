import { Button, ButtonGroup, Container, Stack } from "react-bootstrap";

// Strips ANSI code from pretty error messages
import Ansi from "ansi-to-react";
import stripAnsi from "strip-ansi";

import useStore from "src/store";
import ConvertInstructionList from "src.functions/ConvertInstructionList";

import { useMemo } from "react";
import CodeRender from "src.components/Shared/CodeRender";
import CopyToClipboard from "react-copy-to-clipboard";

export default function Export() {
  const { instructionList } = useStore();
  const [scriptResult, errorString] = useMemo(
    () => ConvertInstructionList(instructionList),
    [instructionList]
  );

  return (
    <Container>
      <h1>Export Result</h1>
      {scriptResult != null ? (
        <CodeRender>
          {"// Import stuffs\n\n" +
            scriptResult
              .split("\n")
              .filter(
                str =>
                  !(str.startsWith("import ") || str.startsWith("package "))
              )
              .join("\n")
              .trimStart()}
        </CodeRender>
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
      <Stack direction="horizontal" gap={3}>
        <ButtonGroup>
          <Button
            href="https://github.com/RoganMatrivski/AutalonDriver-Java/releases/latest"
            target="_blank"
          >
            Latest Katalon Driver
          </Button>
          <Button
            href="https://github.com/RoganMatrivski/Autalon-Generator/blob/master/docs/USAGE.md"
            target="_blank"
          >
            How to use
          </Button>
        </ButtonGroup>
        <CopyToClipboard
          text={scriptResult || stripAnsi(errorString || "")}
          onCopy={() => alert("Copied")}
        >
          <Button>Copy to Clipboard</Button>
        </CopyToClipboard>
      </Stack>
    </Container>
  );
}
