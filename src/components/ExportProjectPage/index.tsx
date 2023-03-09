import { useMemo, useState } from "react";
import { Button, Container, ProgressBar, Stack } from "react-bootstrap";

import ScrollToBottom from "react-scroll-to-bottom";

import { invoke } from "@tauri-apps/api/tauri";
import { listen } from "@tauri-apps/api/event";

import { Link, useNavigate } from "react-router-dom";

import useStore from "src/store";
import ConvertInstructionList from "src.functions/ConvertInstructionList";

function xoshiro128ss(a: number, b: number, c: number, d: number) {
  return function () {
    var t = b << 9,
      r = a * 5;
    r = ((r << 7) | (r >>> 25)) * 9;
    c ^= a;
    d ^= b;
    b ^= c;
    a ^= d;
    c ^= t;
    d = (d << 11) | (d >>> 21);
    return (r >>> 0) / 4294967296;
  };
}

function rand(seed: number) {
  return xoshiro128ss(0x9e3779b9, 0x243f6a88, 0xb7e15162, seed);
}

const URL =
  "https://github.com/RoganMatrivski/AutalonDriver-Java/releases/download/v0.3.0/autalondriver-v0.3.0-full.jar";

export default function ExportProjectPage() {
  const [progress, setProgress] = useState<number | null>(null);
  const [variant, setVariant] = useState("primary");
  const [log, setLog] = useState("");

  const navigate = useNavigate();

  function appendLog(log: string) {
    setLog(oldLog => oldLog + "\n" + log);
  }

  function handleErrorLog(log: string) {
    setProgress(oldProg => (oldProg == null || oldProg <= 0 ? 100 : oldProg));
    setVariant("danger");
    appendLog(log);
  }

  const { instructionList } = useStore();

  if (instructionList.length <= 0) {
    navigate("/");
  }

  const [scriptResult, errorString] = useMemo(
    () => ConvertInstructionList(instructionList),
    [instructionList]
  );

  if (errorString != null) {
    handleErrorLog(errorString);
  }

  async function handleDownload() {
    const unlisten = [
      await listen("exporter::progress", event =>
        setProgress(event.payload as number)
      ),
      await listen("exporter::log", event =>
        appendLog(event.payload as string)
      ),
    ];

    try {
      await invoke("export_to_katalon_project", {
        src: scriptResult,
      });
    } catch (err) {
      handleErrorLog(err as string);
    }

    unlisten.forEach(fn => fn());

    console.log("Complete!");
  }

  return (
    <Container>
      <Stack direction="horizontal">
        <Link to="/">
          <Button>Back</Button>
        </Link>
        <h1>Export as Project</h1>
      </Stack>
      <ScrollToBottom initialScrollBehavior="auto">
        <div style={{ height: "30vh" }}>
          <code style={{ whiteSpace: "pre-wrap" }}>{log}</code>
        </div>
      </ScrollToBottom>
      <ProgressBar
        now={progress || 100}
        animated={progress === null}
        variant={variant}
      />
      <Button onClick={() => handleDownload()}>Export</Button>
    </Container>
  );
}
