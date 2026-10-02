// Assigned and verified by the new Vercel project; update here for future domains.
export const site = {
  productionOrigin: "https://matthew-gallardo-portfolio.vercel.app" as string | null,
  title: "Matthew Gallardo | Backend Software Engineer",
  description:
    "Backend software engineer working in banking and digital payments with Java, Spring Boot, and event-driven microservices, with a background in full-stack development and machine learning.",
  projectDescription:
    "University projects by Matthew Gallardo spanning full-stack applications, Java database systems, machine learning, Android, and algorithms.",
};

export const navigation = [
  { id: "projects", label: "Projects", number: "01" },
  { id: "experience", label: "Experience", number: "02" },
  { id: "stack", label: "Stack", number: "03" },
  { id: "activity", label: "Activity", number: "04" },
  { id: "education", label: "Education", number: "05" },
  { id: "contact", label: "Contact", number: "06" },
] as const;
