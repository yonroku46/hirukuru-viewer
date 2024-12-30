"use client";

import Image from "next/image";
import SearchBox from "@/components/SearchBox";
import FoodCardSlider from "@/components/FoodCardSlider";

export default function Home() {
  const foods = [
    { id: '1', shopId: 'fuk001', name: '唐揚げ弁当', price: 1000, discountPrice: 950, rating: 4.3, image: 'https://i.pinimg.com/736x/f2/67/df/f267dfdd2b0cb8eac4b5e9674aa49e97.jpg' },
    { id: '2', shopId: 'fuk001', name: '特製のり弁', price: 500, discountPrice: 450, rating: 4.5, image: 'https://i.pinimg.com/736x/d2/bb/52/d2bb52d3639b77f024c8b5a584949644.jpg' },
    { id: '3', shopId: 'fuk001', name: 'チキン南蛮弁当', price: 750, rating: 3.9, image: 'https://i.pinimg.com/236x/42/d7/59/42d7590255cfd29e56db2b3d968419d4.jpg' },
    { id: '4', shopId: 'fuk001', name: 'カレー弁当', price: 550, rating: undefined, image: 'https://i.pinimg.com/236x/3b/4f/0a/3b4f0a758df2243b72d1d4985cda5437.jpg' },
    { id: '5', shopId: 'fuk001', name: '5番弁当', price: 550, rating: undefined, image: 'https://i.pinimg.com/236x/3b/4f/0a/3b4f0a758df2243b72d1d4985cda5437.jpg' },
    { id: '6', shopId: 'fuk001', name: '6番弁当', price: 750, rating: 3.9, image: 'https://i.pinimg.com/236x/42/d7/59/42d7590255cfd29e56db2b3d968419d4.jpg' },
    { id: '7', shopId: 'fuk001', name: '7番弁当', price: 500, rating: 4.5, image: 'https://i.pinimg.com/736x/d2/bb/52/d2bb52d3639b77f024c8b5a584949644.jpg' },
    { id: '8', shopId: 'fuk001', name: '8番弁当', price: 1000, rating: 4.3, image: 'https://i.pinimg.com/236x/fa/bb/37/fabb376e55255930c8f6cc3e4680d239.jpg' },
    { id: '9', shopId: 'fuk001', name: '9番弁当', price: 1000, rating: 4.3, image: 'https://i.pinimg.com/236x/95/a0/44/95a0447698ce226edc3eab2d4bc8d23e.jpg' },
  ];

  return (
    <article className="container">
      <SearchBox />
      <FoodCardSlider
        title="おすすめの弁当"
        data={foods}
      />
      <FoodCardSlider
        title="今話題の弁当"
        data={foods}
      />
    </article>
  );
}
