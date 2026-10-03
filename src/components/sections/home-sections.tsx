import Link from "next/link";
import {
  ArrowDown,
  ArrowUpRight,
  Download,
  MapPin,
  Mail,
  ChevronDown,
} from "lucide-react";
import { profile } from "@/content/profile";
import { featuredProjects } from "@/content/projects";
import { experience } from "@/content/experience";
import { skills } from "@/content/skills";
import { education } from "@/content/education";
import { activity } from "@/content/activity";
import { availableImage } from "@/lib/assets";
import { Portrait, WakaTimeImage } from "@/components/ui/media";
import { CopyEmail } from "@/components/ui/copy-email";
import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { ProjectCard } from "@/components/projects/project-card";
import { CareerClock } from "@/components/ui/career-clock";

export function Hero() {
  return (
    <section id="top" className="hero" aria-labelledby="hero-heading">
      <div className="hero-intro">
        <Portrait image={availableImage(profile.portrait)} />
        <div className="hero-identity">
          <p className="eyebrow">Backend Software Engineer</p>
          <h1 id="hero-heading">
            Matthew
            <br className="desktop-name-break" /> Gallardo
            <span className="accent">.</span>
          </h1>
          <p className="location">
            <MapPin size={14} aria-hidden="true" />
            {profile.location}
          </p>
        </div>
      </div>
      <div className="hero-copy">
        <p className="hero-headline">{profile.headline}</p>
        <p className="hero-description">{profile.introduction}</p>
        <CareerClock />
        <div className="hero-actions">
          <Link href="/#projects" className="button button-primary">
            View projects
            <ArrowDown size={16} aria-hidden="true" />
          </Link>
          <a
            href={profile.resume}
            className="button button-secondary"
            download="Matthew-Gallardo-Resume-2026.pdf"
          >
            <Download size={16} aria-hidden="true" />
            Download resume
          </a>
        </div>
        <div className="hero-socials">
          <a className="text-link" href={profile.github}>
            GitHub
            <ArrowUpRight size={14} aria-hidden="true" />
          </a>
          <a className="text-link" href={profile.linkedin}>
            LinkedIn
            <ArrowUpRight size={14} aria-hidden="true" />
          </a>
          <Link className="text-link" href="/#contact">
            Contact
            <ArrowUpRight size={14} aria-hidden="true" />
          </Link>
        </div>
      </div>
      <div className="hero-footnote">
        <span>JAVA / SPRING BOOT / DIGITAL PAYMENTS</span>
        <span className="hero-line" aria-hidden="true" />
      </div>
    </section>
  );
}

export function SelectedProjects() {
  return (
    <Section
      id="projects"
      number="03"
      title="Selected projects"
      intro="Professional contributions in banking and digital payments, alongside university projects in full-stack development, databases, and machine learning."
      action={{ href: "/projects", label: "All projects" }}
    >
      <div className="project-list">
        {featuredProjects.map((project, index) => (
          <Reveal key={project.slug} delay={index * 0.045}>
            <ProjectCard project={project} index={index + 1} compact />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

export function ExperienceSection() {
  return (
    <Section id="experience" number="01" title="Professional experience">
      <div className="experience-list">
        {experience.map((job) => (
          <article className="experience-item" key={job.employer}>
            <span
              className={`timeline-marker ${!job.end ? "timeline-current" : ""}`}
              aria-hidden="true"
            />
            <div className="experience-meta">
              <p className="mono">{job.period}</p>
              {!job.end && <span className="current-role">Current role</span>}
              <p>{job.location}</p>
            </div>
            <div className="experience-copy">
              <p className="employer">{job.employer}</p>
              <h3>{job.title}</h3>
              {job.introduction && (
                <p className="job-intro">{job.introduction}</p>
              )}
              <ul className="experience-highlights">
                {job.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
              <ul className="tags" aria-label={`${job.employer} technologies`}>
                {job.technologies.map((technology) => (
                  <li key={technology}>{technology}</li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}

export function StackSection() {
  return (
    <Section
      id="stack"
      number="02"
      title="Technical stack"
      intro="Technologies used across my professional work and academic projects."
    >
      <div className="skills-grid">
        {skills.map((group) => (
          <div className="skill-group" key={group.label}>
            <h3>{group.label}</h3>
            <ul className="skill-items">
              {group.technologies.map((technology) => (
                <li key={technology}>{technology}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}

export function CodingActivity() {
  return (
    <Section
      id="activity"
      number="04"
      title="Coding activity"
      intro="My tracked coding activity on WakaTime."
      action={{ href: activity.profileUrl, label: "View profile" }}
    >
      <div className="activity-panel">
        <div className="activity-summary">
          <div>
            <span className="eyebrow">Tracked time</span>
            <p className="activity-period">{activity.period}</p>
          </div>
          <WakaTimeImage
            src={activity.badgeUrl}
            alt="WakaTime total tracked coding time, all time"
          />
        </div>
        <details className="activity-disclosure">
          <summary>
            <span>
              Language breakdown <span className="muted">— all time</span>
            </span>
            <ChevronDown size={17} aria-hidden="true" />
          </summary>
          <figure>
            <WakaTimeImage
              src={activity.chartUrl}
              alt="WakaTime language breakdown over all time. View the WakaTime profile for details."
              chart
            />
            <figcaption>
              Languages over all time ·{" "}
              <a href={activity.profileUrl}>
                Powered by WakaTime
                <ArrowUpRight size={12} aria-hidden="true" />
              </a>
            </figcaption>
          </figure>
        </details>
      </div>
    </Section>
  );
}

export function EducationSection() {
  return (
    <Section id="education" number="05" title="Education">
      <div className="education">
        <div className="education-meta">
          <span className="mono">{education.period}</span>
          <span>{education.location}</span>
        </div>
        <h3>{education.institution}</h3>
        <p>{education.degree}</p>
        <ul className="distinctions">
          {education.distinctions.map((distinction) => (
            <li key={distinction}>{distinction}</li>
          ))}
        </ul>
      </div>
    </Section>
  );
}

export function ContactSection() {
  return (
    <Section id="contact" number="06" title="Get in touch">
      <div className="contact-panel">
        <p className="contact-intro">
          For questions about my work or projects, email me or connect on
          LinkedIn.
        </p>
        <a className="contact-email" href={`mailto:${profile.email}`}>
          {profile.email}
          <ArrowUpRight size={22} aria-hidden="true" />
        </a>
        <div className="contact-actions">
          <a className="button button-primary" href={`mailto:${profile.email}`}>
            <Mail size={16} aria-hidden="true" />
            Email Matthew
          </a>
          <CopyEmail email={profile.email} />
        </div>
        <a href={profile.linkedin} className="text-link">
          Connect on LinkedIn
          <ArrowUpRight size={14} aria-hidden="true" />
        </a>
      </div>
    </Section>
  );
}
