import type { Viewport } from "next";
import { Noto_Sans_JP } from "next/font/google";
import dynamic from 'next/dynamic';
import { ThemeProvider } from "@/components/provider/MuiProvider";
import { generatePageMetadata } from "@/common/lib/Metadata";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
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

const SnackbarProvider = dynamic(() => import('@/components/provider/SnackbarProvider'), {
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
    <html lang="ja">
      <body className={`${notoSansJP.className}`}>
        <SnackbarProvider>
          <ThemeProvider>
            <ReduxProvider>
              <Header />
              <main>
                {children}
              </main>
              <Footer />
            </ReduxProvider>
          </ThemeProvider>
        </SnackbarProvider>
      </body>
    </html>
  );
}