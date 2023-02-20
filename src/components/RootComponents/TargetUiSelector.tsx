import { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";

import useStore from "src/store";
import { TargetUI } from "src/structs/Interface/TargetUI";

export default function TargetUiSelector() {
  const {
    targetUI,
    setTargetUIClearInstruction,
    instructionList,
    clearInstruction,
  } = useStore();

  const [newTargetUi, setNewTargetUi] = useState(TargetUI.ExtUI);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  function onTargetChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const newTarget = event.target.value;

    if (instructionList.length == 0) {
      setTargetUIClearInstruction(newTarget as TargetUI);
      return;
    }

    if (newTarget != targetUI) {
      setNewTargetUi(newTarget as TargetUI);
      setShowConfirmModal(true);
    }
  }

  function confirmTargetChange() {
    setTargetUIClearInstruction(newTargetUi);
    setShowConfirmModal(false);
  }

  return (
    <>
      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)}>
        <Modal.Header>
          <Modal.Title>Confirm Change</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to change the UI target?</p>
          <p>
            <strong>All current instruction list will be lost!</strong>
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={confirmTargetChange} variant="danger">
            Yes
          </Button>
          <Button onClick={() => setShowConfirmModal(false)}>No</Button>
        </Modal.Footer>
      </Modal>
      <Form.Select
        className="w-auto"
        value={targetUI}
        onChange={onTargetChange}
      >
        <option value={TargetUI.ExtUI}>ExtUI</option>
        <option value={TargetUI.MaterialUI}>MaterialUI</option>
      </Form.Select>
    </>
  );
}
