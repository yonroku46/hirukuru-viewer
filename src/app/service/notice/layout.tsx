import { Suspense } from 'react';
import { generatePageMetadata } from "@/common/lib/Metadata";
import Loading from '@/app/loading';

export async function generateMetadata() {
  return generatePageMetadata('service/notice');
}

export default function ServiceNoticeLayout({ children }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Suspense fallback={<Loading />}>
      {children}
    </Suspense>
  );
}