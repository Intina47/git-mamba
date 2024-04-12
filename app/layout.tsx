import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import Head from 'next/head';
// import ChristmasIcons from './components/ChristmasIcons';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
 title: 'Isaiah Ntina Portfolio',
 description: 'Student @ UOD | Software Developer',
};

export default function RootLayout({
 children,
}: {
  children: React.ReactNode
}) {
 return (
  <html lang="en">
   <Head>
    <meta charSet="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="icon" href="./favicon.ico" />
   </Head>
   <body className={inter.className}>
    {/* Christmas icons */}
    {/* <ChristmasIcons /> */}
    {children}
    <Analytics />
   </body>
  </html>
 );
}
