import type { Metadata } from 'next';
import { Inter, Sarabun } from 'next/font/google';
import { Toaster } from 'react-hot-toast';

import { ConditionalAuthProvider } from '@/contexts/ConditionalAuthProvider';
import '@/styles/globals.css';

const inter = Inter({ subsets: ['latin'] });
const sarabun = Sarabun({ 
  weight: ['300', '400', '500', '700'],
  subsets: ['latin', 'thai'],
  variable: '--font-sarabun',
});

export const metadata: Metadata = {
  title: 'ระบบบริหารจัดการทุนการศึกษา - คณะเศรษฐศาสตร์ มหาวิทยาลัยธรรมศาสตร์',
  description: 'Scholarship Management System - Faculty of Economics, Thammasat University',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th" className={sarabun.variable}>
      <body className="font-sarabun antialiased text-base" suppressHydrationWarning={true}>
        <ConditionalAuthProvider>
          {children}
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
        </ConditionalAuthProvider>
      </body>
    </html>
  );
}