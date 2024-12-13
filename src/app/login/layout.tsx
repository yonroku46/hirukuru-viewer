import { Suspense } from 'react';
import { generatePageMetadata } from "@/common/lib/Metadata";
import Loading from '@/app/loading';

export async function generateMetadata() {
  return generatePageMetadata('login');
}

export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Suspense fallback={<Loading />}>
      {children}
    </Suspense>
  );
}