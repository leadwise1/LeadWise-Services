export const metadata = {
  title: "Career Pathfinder | LeadWise Foundation",
  description:
    "Discover the career path that fits you. Understand what you can do, explore what you want to become, and get a personalized AI roadmap — powered by LeadWise Pathfinder.",
  keywords: [
    "career pathfinder",
    "career discovery tool",
    "career quiz",
    "job fit assessment",
    "career path AI",
    "LeadWise career tool",
    "career roadmap",
  ],
  openGraph: {
    title: "Career Pathfinder | LeadWise Foundation",
    description:
      "Find your ideal career path with our AI-powered Pathfinder. Get matched to job titles, skill roadmaps, and salary ranges tailored to your profile.",
    url: "https://services.letsleadwise.org/pathfinder",
    siteName: "LeadWise Foundation",
    images: [
      {
        url: "/logolw.jpg",
        width: 1200,
        height: 630,
        alt: "LeadWise Career Pathfinder",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Career Pathfinder | LeadWise Foundation",
    description:
      "AI-powered career discovery tool — find your path, your job titles, and your roadmap.",
    images: ["/logolw.jpg"],
  },
};

export default function PathfinderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
