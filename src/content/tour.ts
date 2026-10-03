export type TourStep = Readonly<{
  id: string;
  target: string;
  title: string;
  explanation: string;
}>;

export const tourSteps = [
  {
    id: "welcome",
    target: "hero-heading",
    title: "Welcome",
    explanation:
      "Hi, I’m Matt. Welcome to my portfolio. My work focuses on banking and digital payments. Let me show you around.",
  },
  {
    id: "experience",
    target: "experience-heading",
    title: "Experience",
    explanation:
      "Here’s my backend engineering experience, including payments and transfers work at Security Bank.",
  },
  {
    id: "stack",
    target: "stack-heading",
    title: "Technical stack",
    explanation:
      "These are technologies I’ve used across professional work and academic projects.",
  },
  {
    id: "projects",
    target: "projects-heading",
    title: "Projects",
    explanation:
      "Start with my work on the Security Bank App, then explore university projects. All projects opens the full collection.",
  },
  {
    id: "activity",
    target: "activity-heading",
    title: "Coding activity",
    explanation:
      "This is my tracked coding activity on WakaTime. Expand the breakdown to see languages over all time.",
  },
  {
    id: "education",
    target: "education-heading",
    title: "Education",
    explanation:
      "I studied Computer Science at PUP and graduated Magna Cum Laude.",
  },
  {
    id: "contact",
    target: "contact-heading",
    title: "Get in touch",
    explanation:
      "You can email me or connect on LinkedIn. Thanks for taking a look.",
  },
] as const satisfies readonly TourStep[];

export const TOUR_READING_TIME = 8000;
export const TOUR_STORAGE_KEY = "mg-portfolio-tour-v1";
