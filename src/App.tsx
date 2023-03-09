import "bootstrap/dist/css/bootstrap.min.css";

import React, { useState } from "react";
import { Container } from "react-bootstrap";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Root from "src.components/RootPage/index";
import Export from "src/components/ExportPage";
import ExportProject from "src/components/ExportProjectPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
  },
  { path: "/export", element: <Export /> },
  { path: "/exportproject", element: <ExportProject /> },
]);

function App() {
  return (
    <React.Fragment>
      <DndProvider backend={HTML5Backend}>
        <RouterProvider router={router} />
      </DndProvider>
    </React.Fragment>
  );
}

export default App;
