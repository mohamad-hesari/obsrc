import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

declare global {
  interface Array<T> {
    unique(key?: keyof T): T[];
  }
}

Array.prototype.unique = function (key?) {
  return [
    ...new Map(this.map((item) => [key ? item[key] : item, item])).values(),
  ];
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
