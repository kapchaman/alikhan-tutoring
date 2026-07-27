import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["cyrillic", "latin"],
});

export const metadata: Metadata = {
  title: "Alikhan Tutoring LMS",
  description: "Персональная образовательная платформа и органайзер для репетитора. Управление расписанием, учениками и домашними заданиями.",
  keywords: ["репетитор", "LMS", "обучение", "органайзер", "расписание"],
  authors: [{ name: "Alikhan" }],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Alikhan Tutoring LMS",
    description: "Персональная платформа для репетитора",
    type: "website",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
