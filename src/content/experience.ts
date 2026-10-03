import type { Experience } from "../types/content.ts";

export const experience: readonly Experience[] = [
  {
    employer: "Security Bank Corporation",
    title: "Backend Software Engineer",
    start: "2024-09-02",
    period: "Sep 2024 — Present",
    location: "Makati, Metro Manila",
    introduction:
      "Backend development and production support in the Security Bank Mobile Application Payments & Transfers Squad.",
    technologies: [
      "Java",
      "Reactive Spring Boot",
      "GraphQL",
      "Apache Kafka",
      "MongoDB",
      "AWS",
    ],
    highlights: [
      "Selected for the first cadetship program and completed six months of training in Java backend development, microservices, secure banking systems, and production support.",
      "Delivered backend development and production support for QRPH, InstaPay, PESONet, and Prepaid Mobile Reload.",
      "Contributed to the end-to-end development and production release of PESONet payments.",
      "Led backend development of Prepaid Mobile Reload as the primary point of contact, coordinating across teams through production delivery.",
      "Contributed to the development and rollout of QRPH peer-to-peer payments.",
    ],
  },
  {
    employer: "Baytech BPO Corporation",
    title: "Software Engineering Intern",
    start: "2023-08",
    end: "2023-09",
    period: "Aug — Sep 2023",
    location: "Pasig, Metro Manila",
    technologies: ["JavaScript", "Node.js", "Jest", "Playwright", "Docker"],
    highlights: [
      "Contributed to frontend user experience and performance improvements.",
      "Implemented Docker containerization.",
      "Built unit and automation tests using Jest and Playwright.",
    ],
  },
];
