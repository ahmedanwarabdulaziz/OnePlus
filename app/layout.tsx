import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

export const metadata: Metadata = {
  title: "One Plus Training & Development",
  description: "Professional training and development programs",
};

// Root layout - Next.js requires html and body tags
// AuthProvider is added here so it's available for all routes
// ThemeProvider is only used in admin pages to avoid conflicts with Tailwind CSS
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning>
      <body suppressHydrationWarning>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
