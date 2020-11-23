import React from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Navbar, Nav, Container, Button, Spinner } from "react-bootstrap";
import { GlobalContext } from "../contexts/appContext";

const Header = () => {
  const { start, setStart, model } = GlobalContext();

  const stopHandler = (e) => {
    setStart(false);
  };

  const startHandler = (e) => {
    setStart(true);
  };

  return (
    <header>
      <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand>
              <i className="fas fa-home"></i>
            </Navbar.Brand>
          </LinkContainer>

          <Nav className="ml-auto">
            {model ? (
              <>
                <Nav.Link onClick={startHandler} disabled={start}>
                  <i className="fas fa-play"></i>Start
                </Nav.Link>
                <Nav.Link onClick={stopHandler} disabled={!start}>
                  <i className="fas fa-stop-circle"></i>Stop
                </Nav.Link>{" "}
              </>
            ) : (
              <Button variant="primary" disabled>
                <Spinner
                  as="span"
                  animation="grow"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
                model loading...
              </Button>
            )}
          </Nav>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
