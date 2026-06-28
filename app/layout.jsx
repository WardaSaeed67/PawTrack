import { Nunito } from 'next/font/google';
import './globals.css';

const nunito = Nunito({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800', '900'],
  variable: '--font-nunito',
  display: 'swap',
});

export const metadata = {
  title: 'PawTrack · Multi-Pet Dashboard',
  description: 'Premium client-side multi-page pet care tracking platform',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={nunito.className}>
        {children}
      </body>
    </html>
  );
}
