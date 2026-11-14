interface JsonLdProps {
  data: Record<string, any>;
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function RootJsonLd() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://cybersecurity-productivity-os.vercel.app";

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${baseUrl}/#website`,
    name: "Cybersecurity Productivity OS",
    url: baseUrl,
    inLanguage: "en-US",
    description: "Production operating system for cybersecurity engineering, technical knowledge retention, and habit mastery.",
    publisher: {
      "@type": "Organization",
      name: "Cybersecurity Productivity OS",
      url: baseUrl,
      logo: `${baseUrl}/icon.svg`,
    },
  };

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "@id": `${baseUrl}/#application`,
    name: "Cybersecurity Productivity OS",
    url: baseUrl,
    applicationCategory: "EducationalApplication, ProductivityApplication",
    operatingSystem: "Web Browser",
    browserRequirements: "Requires modern web browser with JavaScript enabled",
    description: "Personalized learning operating system combining adaptive R0-R7 spaced repetition, active recall testing, 5-stage programming retention, and study management.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [
      "Adaptive R0-R7 Spaced Repetition Engine",
      "8-Mode Active Recall Testing Studio",
      "5-Stage Practical Programming Retention Lab",
      "Interactive Technical Mistake & Problem Library",
      "AI-Generated Cornell Revision Notes",
      "Mastery Exams & Daily Synthesis Quizzes",
      "Habit Tracking & Pomodoro Focus Timer",
      "Study Abroad & Fellowship Application Tracker",
    ],
  };

  return (
    <>
      <JsonLd data={websiteSchema} />
      <JsonLd data={softwareSchema} />
    </>
  );
}

export function BreadcrumbJsonLd({
  items,
}: {
  items: { name: string; url: string }[];
}) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://cybersecurity-productivity-os.vercel.app";

  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${baseUrl}${item.url}`,
    })),
  };

  return <JsonLd data={schema} />;
}
