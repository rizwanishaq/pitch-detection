import React from "react";
import { BrowserRouter as Router } from "react-router-dom";

import ProcessAudio from "./components/ProcessAudio";
import Header from "./components/Header";
import { GlobalContext } from "./contexts/appContext";
import { Container } from "react-bootstrap";

function App() {
  const { model, start } = GlobalContext();
  return (
    <Router>
      <Header />
      <Container>{model && start && <ProcessAudio />}</Container>
    </Router>
  );
}

export default App;
