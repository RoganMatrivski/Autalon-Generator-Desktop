import { Button, ButtonGroup } from "react-bootstrap";
import useTemporalStore from "../temporalStore";

export default function UndoRedoButton() {
  const { undo, redo, pastStates, futureStates } = useTemporalStore();
  const canUndo = !!pastStates.length;
  const canRedo = !!futureStates.length;

  console.log(pastStates);

  function handleUndo() {
    const prevState = pastStates.at(-1);

    if (prevState?.instructionList.some(x => x.name == null)) {
      // It was an insertion action, skip it
      undo(2);
    } else {
      // Other actions, undo normally.
      undo();
    }
  }

  function handleRedo() {
    const futureState = futureStates.at(-1);

    if (futureState?.instructionList.some(x => x.name == null)) {
      // It was an insertion action, skip it
      redo(2);
    } else {
      // Other actions, redo normally.
      redo();
    }
  }

  return (
    <ButtonGroup>
      <Button disabled={!canUndo} onClick={handleUndo}>
        Undo
      </Button>
      <Button disabled={!canRedo} onClick={handleRedo}>
        Redo
      </Button>
    </ButtonGroup>
  );
}
