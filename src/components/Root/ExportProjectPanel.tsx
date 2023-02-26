import { useState } from "react";
import { Button, Modal } from "react-bootstrap";

enum ModalState {
  Hidden,
  Predownload,
  Download,
  Postdownload,
}

export default function ExportProjectPanel() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Modal show={showModal != false} onHide={() => setShowModal(false)}>
        <Modal.Header>
          <Modal.Title>Export as Project</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            This app will download the driver and the project zip file needed
            for generating the project zip.
          </p>
          <p>Click start to begin.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setShowModal(true)}>Start</Button>
          <Button onClick={() => setShowModal(false)}>Cancel</Button>
        </Modal.Footer>
      </Modal>
      <Button onClick={() => setShowModal(true)}>Export as Project</Button>
    </>
  );
}
