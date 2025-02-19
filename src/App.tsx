import React from "react";
import { Button } from "./Button";
const logo = new URL("./sample.png", import.meta.url).href;

export function App() {
  return (
    <div>
      <h1>Hello typescript!</h1>
      <Button>Click me</Button>
      <img src={logo} alt="logo" height={100} />
    </div>
  );
}
