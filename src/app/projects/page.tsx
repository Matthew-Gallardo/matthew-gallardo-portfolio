import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { projects } from "@/content/projects";
import { site } from "@/content/site";
import { pageMetadata } from "@/lib/metadata";
import { ProjectCard } from "@/components/projects/project-card";

export const metadata = pageMetadata(
  "/projects",
  "Projects | Matthew Gallardo",
  site.projectDescription,
);

export default function ProjectsPage() {
  return (
    <>
      <header className="projects-header">
        <Link href="/" className="text-link">
          <ArrowLeft size={15} aria-hidden="true" />
          Back to overview
        </Link>
        <p className="eyebrow">PROJECT INVENTORY</p>
        <h1>
          Work & projects<span className="accent">.</span>
        </h1>
        <p>
          Professional contributions to digital banking, alongside university
          projects exploring full-stack applications, database systems, machine
          learning, and algorithms.
        </p>
        <div className="inventory-note">
          <span className="mono">
            {String(projects.length).padStart(2, "0")} PROJECTS
          </span>
          <span>1 professional project · 7 academic projects</span>
        </div>
      </header>
      <div className="projects-grid">
        {projects.map((project, index) => (
          <ProjectCard key={project.slug} project={project} index={index + 1} />
        ))}
      </div>
    </>
  );
}
