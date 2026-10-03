export type ImageAsset = Readonly<{
  src: string;
  alt: string;
  width: number;
  height: number;
  focalPosition?: string;
}>;

export type Profile = Readonly<{
  name: string;
  initials: string;
  title: string;
  location: string;
  headline: string;
  introduction: string;
  email: string;
  github: string;
  linkedin: string;
  resume: string;
  portrait?: ImageAsset;
}>;

export type Project = Readonly<{
  slug: string;
  name: string;
  category: string;
  summary: string;
  technologies: readonly string[];
  kind: "professional" | "academic";
  repository?: string;
  website?: string;
  featuredOrder?: number;
  demo?: string;
  contribution?: string;
  image?: ImageAsset;
}>;

export type Experience = Readonly<{
  employer: string;
  title: string;
  start: string;
  end?: string;
  period: string;
  location: string;
  introduction?: string;
  technologies: readonly string[];
  highlights: readonly string[];
}>;

export type SkillGroup = Readonly<{
  label: string;
  technologies: readonly string[];
}>;
export type Education = Readonly<{
  institution: string;
  degree: string;
  period: string;
  location: string;
  distinctions: readonly string[];
}>;
export type ActivityConfig = Readonly<{
  provider: string;
  profileUrl: string;
  badgeUrl: string;
  chartUrl: string;
  period: string;
}>;
