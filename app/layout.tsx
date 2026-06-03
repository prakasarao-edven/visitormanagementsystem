import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Visitor Management System',
  description: 'Digital platform for managing visitor registrations and check-ins',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
