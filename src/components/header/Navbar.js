import { Outlet} from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

function ColorSchemesExample() {
  return (
    <>
      <Navbar bg="dark" variant="dark" className="px-5">
          <Navbar.Brand href="/">Open AI Detector</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="/">Home</Nav.Link>
          </Nav>
      </Navbar>
      <Outlet/>
    </>
  );
}

export default ColorSchemesExample;

// export default Layout;