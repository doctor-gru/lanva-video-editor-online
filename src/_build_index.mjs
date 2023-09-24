import React from "react";
import * as ReactDOM from "react-dom";
import "./index.css";
import App from "./App";

window.React = React;
window.PReact = React;
window.PReactDom = ReactDOM;
window.PMyApp = App;

const fonts = [
  {
    name: "Futura",
    url: "https://fonts.googleapis.com/css2?family=Futura:wght@400;700&display=swap",
  },
  {
    name: "Liberation Sans",
    url: "https://fonts.googleapis.com/css2?family=Liberation+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap",
  },
  {
    name: "Courier Prime",
    url: "https://fonts.googleapis.com/css2?family=Courier+Prime:ital,wght@0,400;0,700;1,400;1,700&display=swap",
  },
  {
    name: "PT Mono",
    url: "https://fonts.googleapis.com/css2?family=PT+Mono&display=swap",
  },
  {
    name: "EB Garamond",
    url: "https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,700;1,400;1,700&display=swap",
  },
  {
    name: "Palladio",
    url: "https://fonts.googleapis.com/css2?family=Palladio:ital,wght@0,400;0,700;1,400;1,700&display=swap",
  },
];

fonts.forEach((font) => {
  const link = document.createElement("link");

  link.href = font.url;
  link.rel = "stylesheet";

  document.head.appendChild(link);
});
