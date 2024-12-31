import { Suspense } from 'react';
import { generatePageMetadata } from "@/common/lib/Metadata";
import Loading from '@/app/loading';

export async function generateMetadata() {
  // const shopInfo = await getShopInfo(params.shopId);
  const shopInfo = {
    id: 1,
    name: '唐揚げ壱番屋',
    description: '揚げ物専門店',
    image: 'https://i.pinimg.com/236x/71/65/43/716543eb8e6907d7163b55000376e2be.jpg',
    reviewcount: 1120,
    ratingAvg: 4.5,
  };
  return generatePageMetadata('shop', shopInfo.name);
}

export default function ShopInfoLayout({
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