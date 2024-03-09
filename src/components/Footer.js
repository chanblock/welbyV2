
import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import "../styles/Footer.css";

const Footer = () => {
  return (
    <footer className="footer py-3">
      <Container>
        <Row>
          <Col className="text-center">
            © {new Date().getFullYear()} Welly. All rights reserved.
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
