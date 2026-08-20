import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Hybrid Deterministic Travel Planner',
  description: 'AI Natural Language Intent Parsing + Deterministic SQL Filtering & Spatial Routing Engine',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <main className="main-wrapper">{children}</main>
      </body>
    </html>
  );
}
