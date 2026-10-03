import {
  Hero,
  SelectedProjects,
  ExperienceSection,
  StackSection,
  CodingActivity,
  EducationSection,
  ContactSection,
} from "@/components/sections/home-sections";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ExperienceSection />
      <StackSection />
      <SelectedProjects />
      <CodingActivity />
      <EducationSection />
      <ContactSection />
    </>
  );
}
