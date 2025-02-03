import React from "react";
import Navbar from "./components/Navbar.js";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import "./App.css";

function App() {
  return (
    <div className="App">
      <Navbar />
      <section className="hero-section">
        <h1>Hi, I'm Your Name</h1>
        <p>Full Stack Developer</p>
      </section>
      <Skills />
      <Projects />
      <footer id="contact" className="footer-section">
        <h2>Get in Touch</h2>
        <div className="social-links">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>
          <a href="mailto:your.email@example.com">Email</a>
        </div>
      </footer>
    </div>
  );
}

export default App;
