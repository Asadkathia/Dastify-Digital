import type { Metadata } from 'next';
import { Lato, Manrope } from 'next/font/google';
import '../globals.css';

export const preferredRegion = 'sin1';

const manrope = Manrope({
  variable: '--font-manrope',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
});

const lato = Lato({
  variable: '--font-lato',
  subsets: ['latin'],
  weight: ['300', '400', '700', '900'],
});

export const metadata: Metadata = {
  title: 'Dastify Digital',
  description: 'The creative authority for healthcare growth.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${manrope.variable} ${lato.variable}`}>
      <body>{children}</body>
    </html>
  );
}
