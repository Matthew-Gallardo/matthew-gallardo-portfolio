import type { Project } from "../types/content.ts";

export const projects: readonly Project[] = [
  {
    slug: "security-bank-app",
    name: "Security Bank App",
    kind: "professional",
    category: "Professional work / Banking & digital payments",
    summary:
      "Backend development and production support for payments and transfers in the Security Bank mobile app, including QRPH, InstaPay, PESONet, and Prepaid Mobile Reload.",
    contribution:
      "As part of the Payments & Transfers Squad, I contributed to PESONet’s end-to-end development and production release, led backend development for Prepaid Mobile Reload, and contributed to the QRPH peer-to-peer rollout.",
    technologies: [
      "Java",
      "Spring WebFlux",
      "GraphQL",
      "Apache Kafka",
      "MongoDB",
      "AWS",
    ],
    website: "https://www.securitybank.com/apps/personal-banking/",
    featuredOrder: 1,
  },
  {
    slug: "cast-type",
    kind: "academic",
    name: "Cast Type",
    category: "University project / Full-stack",
    summary:
      "Mechanical-keyboard e-commerce project with Express REST APIs, MongoDB, a React interface, Redux state management, and Stripe sandbox integration.",
    technologies: [
      "React",
      "Node.js",
      "Express",
      "MongoDB",
      "Redux",
      "Styled Components",
      "Stripe sandbox",
    ],
    repository:
      "https://github.com/Matthew-Gallardo/MERN-E-Commerce-for-Mechanical-Keyboards",
    featuredOrder: 2,
  },
  {
    slug: "easypc",
    kind: "academic",
    name: "EasyPC Database Management System",
    category: "University project / Java & databases",
    summary:
      "Academic inventory and point-of-sale project modeled after EasyPC, with a Java Swing interface and MySQL database for products, inventory, and sales.",
    technologies: ["Java", "Swing", "MySQL"],
    repository:
      "https://github.com/Matthew-Gallardo/Database-PoS-Inventory-System-for-EasyPc",
    featuredOrder: 3,
  },
  {
    slug: "illuscan",
    kind: "academic",
    name: "Illuscan",
    category: "University thesis / Machine learning",
    summary:
      "University thesis investigating GAN-generated image detection through spatial-frequency fusion of Local Binary Pattern and Discrete Wavelet Transform features with an SVM classifier.",
    technologies: ["Python", "LBP", "DWT", "SVM"],
    repository:
      "https://github.com/Deynnnyellll/Detection-of-GAN-Generated-Images-using-Spatial-Frequency-Domain-Fusion-Data",
    featuredOrder: 4,
  },
  {
    slug: "freedom-wall",
    kind: "academic",
    name: "Open Source Freedom Wall",
    category: "University project / Full-stack",
    summary:
      "MERN application for computer science students to share posts, using Express REST APIs and React Hooks and Context API for frontend state.",
    technologies: [
      "React",
      "Node.js",
      "Express",
      "MongoDB",
      "React Hooks",
      "Context API",
    ],
    repository: "https://github.com/Matthew-Gallardo/CompScie-FreedomWall",
  },
  {
    slug: "camanava",
    kind: "academic",
    name: "Temperature Forecast and Prediction in CAMANAVA",
    category: "University project / Machine learning",
    summary:
      "University project using multiple linear regression to estimate temperatures in Caloocan, Malabon, Navotas, and Valenzuela from weather measurements.",
    technologies: [
      "Python",
      "pandas",
      "scikit-learn",
      "Multiple linear regression",
    ],
    repository:
      "https://github.com/Matthew-Gallardo/Temperature-Forecast-Prediction-in-CAMANAVA-using-Regression",
  },
  {
    slug: "voxtunes",
    kind: "academic",
    name: "VoxTunesAI",
    category: "University project / Android",
    summary:
      "Android music-player project using Java and Android’s Speech Recognition API to control playback through spoken commands.",
    technologies: ["Java", "Android", "Speech Recognition API"],
    repository:
      "https://github.com/Matthew-Gallardo/Android-Voice-Controlled-Music-Player",
  },
  {
    slug: "sackcal",
    kind: "academic",
    name: "SackCal",
    category: "University project / Algorithms",
    summary:
      "A 0/1 knapsack calculator using dynamic programming to calculate maximum profit within a weight limit, with explanations of brute-force and dynamic-programming approaches.",
    technologies: ["JavaScript", "HTML", "CSS", "Dynamic programming"],
    repository:
      "https://github.com/Matthew-Gallardo/Bruteforce-Knapsack-Algorithm",
    demo: "https://bruteforce-knapsack-algorithm.vercel.app/",
  },
];

export const featuredProjects = projects
  .filter((project) => project.featuredOrder !== undefined)
  .toSorted((a, b) => a.featuredOrder! - b.featuredOrder!);
