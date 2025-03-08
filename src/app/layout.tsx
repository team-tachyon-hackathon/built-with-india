import type { Metadata } from "next";

import "./globals.css";
import { Providers } from "./providers";
import { ThemeProvider } from "@/components/providers/theme-providers";


export const metadata: Metadata = {
  title: "CI/CD Genie",
  description: "A tool to generate CI/CD pipeline configurations",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
        </ThemeProvider>
          </Providers>
      </body>
    </html>
  );
}
