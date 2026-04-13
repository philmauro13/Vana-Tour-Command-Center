import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'VANA Tour — Command Center',
  description: 'Tour Command Center — mission control for the VANA Lady in Red Tour 2026',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
