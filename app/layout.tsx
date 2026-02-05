import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Community Solar Opportunities | Lumen Energy",
  description: "Explore community solar opportunities for your facilities with Lumen Energy",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Roboto+Mono&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
