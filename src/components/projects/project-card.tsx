import { ArrowUpRight, Code2, Globe } from "lucide-react";
import type { Project } from "@/types/content";
import { availableImage } from "@/lib/assets";
import { ProjectMedia } from "@/components/ui/media";

export function ProjectCard({
  project,
  index,
  compact = false,
}: {
  project: Project;
  index: number;
  compact?: boolean;
}) {
  const Heading = compact ? "h3" : "h2";
  return (
    <article
      className={`${compact ? "project-row" : "project-card"} ${project.kind === "professional" ? "professional-project" : ""}`}
      data-project={project.slug}
    >
      <ProjectMedia
        image={availableImage(project.image)}
        name={project.name}
        index={index}
        compact={compact}
      />
      <div className="project-copy">
        <p className="eyebrow project-category">{project.category}</p>
        <Heading>{project.name}</Heading>
        <p className="project-summary">{project.summary}</p>
        <ul className="tags" aria-label={`${project.name} technologies`}>
          {(compact
            ? project.technologies.slice(0, 4)
            : project.technologies
          ).map((tech) => (
            <li key={tech}>{tech}</li>
          ))}
        </ul>
        {project.contribution && (
          <p className="project-contribution">{project.contribution}</p>
        )}
        <div className="project-actions">
          {project.repository && (
            <a
              href={project.repository}
              className="text-link"
              aria-label={`View ${project.name} repository`}
            >
              <Code2 size={15} aria-hidden="true" />
              Repository
              <ArrowUpRight size={14} aria-hidden="true" />
            </a>
          )}
          {project.website && (
            <a
              href={project.website}
              className="text-link"
              aria-label={`Visit ${project.name} official app page`}
            >
              <Globe size={15} aria-hidden="true" />
              Official app page
              <ArrowUpRight size={14} aria-hidden="true" />
            </a>
          )}
          {project.demo && (
            <a
              href={project.demo}
              className="text-link"
              aria-label={`View ${project.name} live demo`}
            >
              Live demo
              <ArrowUpRight size={14} aria-hidden="true" />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
