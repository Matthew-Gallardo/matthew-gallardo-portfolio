import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { profile } from "../src/content/profile.ts";
import { projects, featuredProjects } from "../src/content/projects.ts";
import { experience } from "../src/content/experience.ts";
import { activity } from "../src/content/activity.ts";
import { education } from "../src/content/education.ts";
import { skills } from "../src/content/skills.ts";

function https(value: string, host?: string) {
  const url = new URL(value);
  assert.equal(url.protocol, "https:", `Expected HTTPS: ${value}`);
  if (host) assert.equal(url.hostname, host);
}

assert.equal(
  projects.length,
  8,
  "The professional project and all seven academic projects are required.",
);
assert.equal(
  projects.filter((project) => project.kind === "academic").length,
  7,
);
assert.equal(
  projects.filter((project) => project.kind === "professional").length,
  1,
);
assert.equal(
  new Set(projects.map((project) => project.slug)).size,
  projects.length,
  "Project slugs must be unique.",
);
assert.deepEqual(
  featuredProjects.map((project) => project.featuredOrder),
  [1, 2, 3, 4],
);
assert.deepEqual(
  featuredProjects.map((project) => project.slug),
  ["security-bank-app", "cast-type", "easypc", "illuscan"],
);
assert.equal(projects.filter((project) => project.demo).length, 1);
for (const project of projects) {
  assert(
    project.name &&
      project.category &&
      project.summary &&
      project.technologies.length,
    `Incomplete project: ${project.slug}`,
  );
  if (project.kind === "academic")
    assert(project.repository, `Academic source missing: ${project.slug}`);
  if (project.kind === "professional")
    assert(
      project.website && project.contribution,
      "Professional work needs a public page and supported contribution.",
    );
  if (project.repository) https(project.repository, "github.com");
  if (project.website) https(project.website, "www.securitybank.com");
  if (project.demo) https(project.demo);
  if (project.image) {
    assert(project.image.src.startsWith("/images/"));
    assert(
      project.image.alt && project.image.width > 0 && project.image.height > 0,
    );
  }
}
for (const job of experience)
  assert(job.employer && job.title && job.start && job.highlights.length);
assert(education.institution && skills.length && profile.email);
assert(profile.resume.startsWith("/resume/"));
assert(
  existsSync(resolve("public", `.${profile.resume}`)),
  "The downloadable resume is required.",
);
https(profile.github, "github.com");
https(profile.linkedin, "www.linkedin.com");
https(activity.profileUrl, "wakatime.com");
https(activity.badgeUrl, "wakatime.com");
https(activity.chartUrl, "wakatime.com");
assert(new URL(activity.badgeUrl).pathname.startsWith("/badge/user/"));
assert(new URL(activity.chartUrl).pathname.startsWith("/share/@MattG/"));
assert.equal(activity.period, "All time");
const copy = JSON.stringify({
  profile,
  projects,
  experience,
  skills,
  education,
  activity,
});
assert(
  !/\p{Extended_Pictographic}/u.test(copy),
  "Interface content must not contain emoji.",
);
console.log(
  "Content validation passed: one professional and seven academic projects, supported links, resume, and WakaTime configuration.",
);
