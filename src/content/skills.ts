import type { SkillGroup } from "../types/content.ts";

export const skills: readonly SkillGroup[] = [
  { label: "Languages", technologies: ["Java", "Python", "JavaScript", "C"] },
  {
    label: "Backend",
    technologies: [
      "Spring Boot",
      "Spring WebFlux",
      "GraphQL",
      "REST APIs",
      "Hibernate",
      "Jakarta EE",
      "Microservices",
    ],
  },
  { label: "Messaging", technologies: ["Apache Kafka", "ActiveMQ"] },
  { label: "Databases", technologies: ["PostgreSQL", "MongoDB", "MySQL"] },
  {
    label: "Cloud & delivery",
    technologies: ["AWS", "Docker", "Argo CD", "Liquibase"],
  },
  { label: "Observability", technologies: ["Datadog", "Kibana"] },
  { label: "Frontend", technologies: ["React", "Vue.js", "HTML", "CSS"] },
  { label: "Testing", technologies: ["Jest", "JUnit", "Playwright"] },
  {
    label: "Tools",
    technologies: [
      "Git",
      "Postman",
      "VS Code",
      "Jupyter Notebook",
      "Google Colab",
      "Android Studio",
    ],
  },
];
