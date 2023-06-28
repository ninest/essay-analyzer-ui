import React from "react";
import ReactDOM from "react-dom/client";
import "./index.scss";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { RootLayout } from "./root.layout";
import { IndexPage } from "./index.page";

const router = createBrowserRouter([
  {
    path:'/',
    element: <RootLayout/>,
    children: [
      {
        index: true,
        element: <IndexPage/>
      }
    ]
  }
])

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
