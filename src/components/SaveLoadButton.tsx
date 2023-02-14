import { useEffect, useMemo } from "react";
import { Button, ButtonGroup } from "react-bootstrap";

import { useFilePicker } from "use-file-picker";
import { saveAs } from "file-saver";

import useStore from "../store";
import FunctionValue from "../structs/Class/FunctionValue";

export default function SaveLoadButton() {
  const { instructionList, setInstruction } = useStore();
  const getStringifiedInstructionList = useMemo(() => {
    return () => {
      return JSON.stringify(instructionList);
    };
  }, [instructionList]);
  const loadStringifiedInstructionList = (instructionList: string) => {
    let parsed: Array<FunctionValue> = JSON.parse(instructionList);
    setInstruction(parsed);
  };

  const [openFileSelector, { filesContent, loading }] = useFilePicker({
    accept: ".json",
  });

  function handleLoadJSON() {
    openFileSelector();
  }

  function handleSaveJSON() {
    const str = getStringifiedInstructionList();
    const txtFile = new Blob([str], { type: "file" });
    saveAs(txtFile, "AutalonInstructionList.json");
  }

  useEffect(() => {
    if (filesContent.length <= 0) return;

    loadStringifiedInstructionList(filesContent[0].content);
  }, [filesContent]);

  return (
    <>
      <ButtonGroup>
        <Button onClick={handleSaveJSON}>Save</Button>
        <Button onClick={handleLoadJSON}>Load</Button>
      </ButtonGroup>
    </>
  );
}
