import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Outfit } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/sidebar";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/theme-provider";
import { RootJsonLd } from "@/components/seo/json-ld";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-heading" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://cybersecurity-productivity-os.vercel.app";

export const viewport: Viewport = {
  themeColor: "#0a0a0c",
  colorScheme: "dark light",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Cybersecurity Productivity OS — Engineer Study & Retention System",
    template: "%s | Cybersecurity Productivity OS",
  },
  description:
    "Production-grade cybersecurity engineering operating system featuring adaptive R0–R7 spaced repetition, active recall testing, 5-stage programming retention, and fellowship tracking.",
  applicationName: "Cybersecurity Productivity OS",
  authors: [{ name: "Mariyamalikho", url: "https://github.com/Mariyamalikho" }],
  creator: "Mariyamalikho",
  publisher: "Cybersecurity Productivity OS",
  keywords: [
    "Cybersecurity",
    "Technical Knowledge Retention System",
    "Spaced Repetition",
    "Active Recall",
    "Network+ N10-009",
    "Python Programming",
    "Security Engineering",
    "Cornell Notes",
    "Study Management OS",
    "Productivity OS",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    siteName: "Cybersecurity Productivity OS",
    title: "Cybersecurity Productivity OS — Engineer Study & Retention System",
    description:
      "Production-grade cybersecurity engineering operating system featuring adaptive R0–R7 spaced repetition, active recall testing, 5-stage programming retention, and fellowship tracking.",
    images: [
      {
        url: "/icon.svg",
        width: 512,
        height: 512,
        alt: "Cybersecurity Productivity OS Logo",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Cybersecurity Productivity OS — Engineer Study & Retention System",
    description:
      "Production-grade cybersecurity engineering operating system featuring adaptive R0–R7 spaced repetition, active recall testing, 5-stage programming retention, and fellowship tracking.",
    images: ["/icon.svg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/icon.svg" }],
  },
};

const cleanEnv = (val?: string) => val?.trim().replace(/^["']|["']$/g, "");

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const publishableKey = cleanEnv(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <RootJsonLd />
      </head>
      <body
        className={`${inter.variable} ${outfit.variable} ${jetbrains.variable} font-sans antialiased bg-background text-foreground flex flex-col lg:flex-row h-screen w-screen overflow-hidden`}
        suppressHydrationWarning
      >
        <ClerkProvider publishableKey={publishableKey}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <Sidebar />
            <main className="flex-1 h-full min-w-0 min-h-0 relative overflow-hidden flex flex-col">
              {children}
            </main>
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
