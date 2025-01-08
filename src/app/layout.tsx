import { Noto_Sans_JP } from "next/font/google";
import Head from 'next/head';
import dynamic from 'next/dynamic';
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { ThemeProvider } from "@/components/mui/MuiProvider";
import { generatePageMetadata } from "@/common/lib/Metadata";
import type { Viewport } from 'next'
import "@/styles/globals.scss";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"]
});

const ReduxProvider = dynamic(() => import('@/store/ReduxProvider'), {
  ssr: false
});

export async function generateMetadata() {
  return generatePageMetadata("home");
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </Head>
      <html lang="ja">
        <body className={`${notoSansJP.className}`}>
          <ThemeProvider>
            <ReduxProvider>
              <Header />
              <main>
                {children}
              </main>
                <Footer />
            </ReduxProvider>
          </ThemeProvider>
        </body>
      </html>
    </>
  );
}