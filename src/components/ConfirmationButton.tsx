import React, { ReactNode, useEffect, useRef, useState } from "react";
import { Button } from "react-bootstrap";

type ConfirmationButtonType = {
  variant: string;
  preConfirmRender: ReactNode;
  postConfirmRender: ReactNode;
  onConfirm: () => void;
  [rest: string]: any;
};

export default function ConfirmationButton(props: ConfirmationButtonType) {
  const [isConfirm, setIsConfirm] = useState(false);
  const wrapperRef = useRef(null);

  const onClickOutside = (e: MouseEvent) => setIsConfirm(false);

  useEffect(() => {
    // Bind the event listener
    document.addEventListener("mousedown", onClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", onClickOutside);
    };
  }, [wrapperRef]);

  return (
    <Button
      ref={wrapperRef}
      variant={props.variant}
      onClick={() => (isConfirm ? props.onConfirm() : setIsConfirm(true))}
    >
      {isConfirm ? props.postConfirmRender : props.preConfirmRender}
    </Button>
  );
}
