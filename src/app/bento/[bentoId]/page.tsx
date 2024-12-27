"use client";

import Image from "next/image";
import Slider, { Settings } from 'react-slick';
import { useRouter } from "next/navigation";
import { Box, Button, Tab, Tabs } from "@mui/material";
import { useRef, useState } from "react";
import FoodCardBox from "@/components/FoodCardBox";
import { currency } from "@/common/utils/StringUtils";

export default function BentoInfoPage(
  { params: { bentoId } }: { params: { bentoId: string } }
) {
  const router = useRouter();

  const shopInfo = {
    id: 1,
    name: '唐揚げ壱番屋',
    description: '揚げ物専門店',
    rating: 4.8,
    reviewcount: 20,
    image: 'https://i.pinimg.com/236x/71/65/43/716543eb8e6907d7163b55000376e2be.jpg',
  };
  const bentoInfo = {
    id: 1,
    name: '唐揚げ弁当',
    description: 'さくさく天ぷらを載せた世界一美味しい弁当です',
    price: 1000,
    discountPrice: 950,
    rating: 4.5,
    reviewcount: 124,
    thumbnail: 'https://i.pinimg.com/736x/f2/67/df/f267dfdd2b0cb8eac4b5e9674aa49e97.jpg',
    recommended: ['味噌汁', '玉子焼き', 'サラダ']
  };
  const foods = [
    { id: 1, name: '唐揚げ弁当', price: 1000, discountPrice: 950, rating: 4.3, image: 'https://i.pinimg.com/736x/f2/67/df/f267dfdd2b0cb8eac4b5e9674aa49e97.jpg' },
    { id: 2, name: '特製のり弁', price: 500, discountPrice: 450, rating: 4.5, image: 'https://i.pinimg.com/736x/d2/bb/52/d2bb52d3639b77f024c8b5a584949644.jpg' },
    { id: 3, name: 'チキン南蛮弁当', price: 750, rating: 3.9, image: 'https://i.pinimg.com/236x/42/d7/59/42d7590255cfd29e56db2b3d968419d4.jpg' },
    { id: 4, name: 'カレー弁当', price: 550, rating: undefined, image: 'https://i.pinimg.com/236x/3b/4f/0a/3b4f0a758df2243b72d1d4985cda5437.jpg' },
    { id: 5, name: '5番弁当', price: 550, rating: undefined, image: 'https://i.pinimg.com/236x/3b/4f/0a/3b4f0a758df2243b72d1d4985cda5437.jpg' },
    { id: 6, name: '6番弁当', price: 750, rating: 3.9, image: 'https://i.pinimg.com/236x/42/d7/59/42d7590255cfd29e56db2b3d968419d4.jpg' },
    { id: 7, name: '7番弁当', price: 500, rating: 4.5, image: 'https://i.pinimg.com/736x/d2/bb/52/d2bb52d3639b77f024c8b5a584949644.jpg' },
    { id: 8, name: '8番弁当', price: 1000, rating: 4.3, image: 'https://i.pinimg.com/236x/fa/bb/37/fabb376e55255930c8f6cc3e4680d239.jpg' },
    { id: 9, name: '9番弁当', price: 1000, rating: 4.3, image: 'https://i.pinimg.com/236x/95/a0/44/95a0447698ce226edc3eab2d4bc8d23e.jpg' },
  ];

  const handleOrder = () => {
    console.log(`주문하기: ${bentoInfo.name}`);
  };

  const [value, setValue] = useState<number>(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <article>
      <div className="container bento">
        <section className="bento-header">
          <div className="image-wrapper">
            <Image
              className="thumbnail"
              src={bentoInfo.thumbnail}
              alt={bentoInfo.name}
              width={500}
              height={260}
            />
          </div>
          <div className="info-wrapper">
            <div className="profile">
              <Image
                className="shop-profile"
                src={shopInfo.image}
                alt={shopInfo.name}
                width={74}
                height={74}
              />
              <button className="order-btn" onClick={handleOrder}>
                今から注文
              </button>
            </div>
            <div className="info-header">
              <h1 className="name">{bentoInfo.name}</h1>
              <p className="rating">{`⭐ ${bentoInfo.rating} (1,500+)`}</p>
            </div>
            {bentoInfo.discountPrice && bentoInfo.discountPrice < bentoInfo.price ?
              <div className="price">
                <p className="current-price on-sale">
                  {currency(bentoInfo.discountPrice)}
                  <span className="unit">円</span>
                </p>
                <p className="origin-price">
                  {currency(bentoInfo.price)}
                  <span className="unit">円</span>
                </p>
                <div className="sale-tag">
                  {`${Math.round((1 - bentoInfo.discountPrice / bentoInfo.price) * 100)}% OFF`}
                </div>
              </div>
              :
              <div className="price">
                <p className="current-price">
                  {currency(bentoInfo.price)}
                  <span className="unit">円</span>
                </p>
              </div>
            }
            <p className="description">
              {bentoInfo.description}
            </p>
          </div>
          {/* <Box sx={{ maxWidth: { xs: '100%' } }}>
            <Tabs
              value={value}
              onChange={handleChange}
              variant="scrollable"
              scrollButtons="auto"
              aria-label="scrollable auto tabs example"
            >
              <Tab label="Item One" />
              <Tab label="Item Two" />
              <Tab label="Item Three" />
              <Tab label="Item Four" />
              <Tab label="Item Five" />
              <Tab label="Item Six" />
              <Tab label="Item Seven" />
            </Tabs>
          </Box> */}
        </section>
        <section className="bento-detail">
          setsumei
        </section>
        <section className="bento-body">
          <FoodCardBox
            title={'当店のおすすめ'}
            data={foods}
          />
        </section>
      </div>
    </article>
  );
}