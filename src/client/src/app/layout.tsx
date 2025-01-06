import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import React, { ReactNode } from 'react';
import QueryClientProvider from '@/components/providers/query-client-provider';
import '@radix-ui/themes/styles.css';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { Theme } from '@radix-ui/themes';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Toaster } from '@/components/ui/toaster';
import Script from 'next/script'
import { hotjar } from 'react-hotjar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'MR Policeman',
  description:
    'MR Policeman is your go-to companion for safer driving. Our app keeps you updated on police radar locations, helping you avoid speeding tickets and drive with confidence. With real-time alerts, a community-driven approach, and customizable features, MR Policeman is designed to enhance your driving experience.',
  generator: 'Next.js',
  manifest: '/manifest.json',
  keywords: ['MR Policeman', 'police radar', 'speeding tickets', 'driving', 'safety', 'alerts'],
  icons: [
    { rel: 'apple-touch-icon', url: 'icons/icon-144.png' },
    { rel: 'icon', url: 'icons/icon-144.png' },
    { rel: 'favicon', url: 'icons/icon-144.png' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Script id="hotjar" strategy="beforeInteractive">
          {`
            (function(h,o,t,j,a,r){
                h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                h._hjSettings={hjid:5226601,hjsv:6};
                a=o.getElementsByTagName('head')[0];
                r=o.createElement('script');r.async=1;
                r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                a.appendChild(r);
            })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
          `}
        </Script>
          <Script id="hotjar-event" strategy="afterInteractive">
            {`
                console.log('Hotjar event listener', hj);
                hj('event', window.location.href);
            `}
          </Script>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Theme>
            <QueryClientProvider>{children}</QueryClientProvider>
            <Toaster />
          </Theme>
        </ThemeProvider>
      </body>
    </html>
  );
}
