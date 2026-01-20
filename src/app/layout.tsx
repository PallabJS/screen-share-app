import type { Metadata } from "next";

import { StoreProvider } from "../redux/provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "GeneaMeet",
  description: "A video meeting app with AI-powered genealogy features.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={"antialiased"}>
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
