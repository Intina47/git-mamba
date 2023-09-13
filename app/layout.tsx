import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
 title: 'Isaiah Ntina\'s Portfolio',
 description: 'Software developer with good work ethos',
};

export default function RootLayout({
 children,
}: {
  children: React.ReactNode
}) {
 return (
  <html lang="en" data-theme="cyberpunk">
   <body className={inter.className}>{children}</body>
  </html>
 );
}
