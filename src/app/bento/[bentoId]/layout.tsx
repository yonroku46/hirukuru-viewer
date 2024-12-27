import { Suspense } from 'react';
import { generatePageMetadata } from "@/common/lib/Metadata";
import Loading from '@/app/loading';
import { config } from '@/config';

export async function generateMetadata() {
  // const bentoInfo = await getBentoInfo(params.bentoId);
  const bentoInfo = {
    id: 1,
    name: '唐揚げ弁当',
    price: 1000,
    rating: 4.5,
    description: 'さくさく天ぷらを載せた世界一美味しい弁当です',
    image: 'https://i.pinimg.com/736x/f2/67/df/f267dfdd2b0cb8eac4b5e9674aa49e97.jpg',
    recommended: ['味噌汁', '玉子焼き', 'サラダ']
  };
  return generatePageMetadata('bento', bentoInfo.name);
}

export default function BentoInfoLayout({
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