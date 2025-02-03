import React from "react";
import ProjectCard from "./ProjectCard";

const Projects = () => {
  const projects = [
    {
      title: "E-commerce Platform",
      description:
        "A full-stack e-commerce application with user authentication and payment processing.",
      techStack: ["React", "Node.js", "MongoDB", "Express"],
      imageUrl: "/images/project1.jpg",
    },
    {
      title: "Task Management App",
      description:
        "Real-time task management system with drag-and-drop functionality.",
      techStack: ["React", "Firebase", "Material-UI"],
      imageUrl: "/images/project2.jpg",
    },
  ];

  return (
    <section id="projects" className="projects-section">
      <h2>Projects</h2>
      <div className="projects-container">
        {projects.map((project, index) => (
          <ProjectCard key={index} {...project} />
        ))}
      </div>
    </section>
  );
};

export default Projects;
