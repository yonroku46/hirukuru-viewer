"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import EventSlider from "@/components/EventSlider";
import FoodCardSlider from "@/components/FoodCardSlider";

import KeyboardArrowRightTwoToneIcon from '@mui/icons-material/KeyboardArrowRightTwoTone';
import QrCodeScannerTwoToneIcon from '@mui/icons-material/QrCodeScannerTwoTone';

export default function Home() {
  const [hasLogin, setHasLogin] = useState<boolean>(false);

  const foods = [
    { id: '1', shopId: 'fuk001', category: 'bento', name: '唐揚げ弁当', price: 1000, discountPrice: 950, rating: 4.3, image: 'https://i.pinimg.com/736x/f2/67/df/f267dfdd2b0cb8eac4b5e9674aa49e97.jpg' },
    { id: '2', shopId: 'fuk001', category: 'bento', name: '特製のり弁', price: 500, discountPrice: 450, rating: 4.5, image: 'https://i.pinimg.com/736x/d2/bb/52/d2bb52d3639b77f024c8b5a584949644.jpg' },
    { id: '3', shopId: 'fuk001', category: 'bento', name: 'チキン南蛮弁当', price: 750, rating: 3.9, image: 'https://i.pinimg.com/236x/42/d7/59/42d7590255cfd29e56db2b3d968419d4.jpg' },
    { id: '4', shopId: 'fuk001', category: 'bento', name: 'カレー弁当', price: 550, rating: undefined, image: 'https://i.pinimg.com/236x/3b/4f/0a/3b4f0a758df2243b72d1d4985cda5437.jpg' },
    { id: '5', shopId: 'fuk001', category: 'bento', name: '5番弁当', price: 550, rating: undefined, image: 'https://i.pinimg.com/236x/3b/4f/0a/3b4f0a758df2243b72d1d4985cda5437.jpg' },
    { id: '6', shopId: 'fuk001', category: 'bento', name: '6番弁当', price: 750, rating: 3.9, image: 'https://i.pinimg.com/236x/42/d7/59/42d7590255cfd29e56db2b3d968419d4.jpg' },
    { id: '7', shopId: 'fuk001', category: 'bento', name: '7番弁当', price: 500, rating: 4.5, image: 'https://i.pinimg.com/736x/d2/bb/52/d2bb52d3639b77f024c8b5a584949644.jpg' },
    { id: '8', shopId: 'fuk001', category: 'bento', name: '8番弁当', price: 1000, rating: 4.3, image: 'https://i.pinimg.com/236x/fa/bb/37/fabb376e55255930c8f6cc3e4680d239.jpg' },
    { id: '9', shopId: 'fuk001', category: 'bento', name: '9番弁当', price: 1000, rating: 4.3, image: 'https://i.pinimg.com/236x/95/a0/44/95a0447698ce226edc3eab2d4bc8d23e.jpg' },
  ];
  const events = [
    { id: '1', title: '謹賀新年', description: '2025年もよろしくお願いします', image: 'https://i.pinimg.com/736x/79/5e/90/795e900bb362815db2aacf0abe9116e8.jpg' },
    { id: '2', title: 'いつでも4%Back!', description: '会員はいつでもポイントバックします', image: 'https://i.pinimg.com/736x/8f/05/4d/8f054d66b37f59a34fd878fc2e783087.jpg' },
    { id: '3', title: '初めてのガイド', href: '/service/help', description: 'ヒルクルの使い方をご紹介します', image: 'https://i.pinimg.com/736x/19/f1/97/19f197e170d66608885cecb06326b8a7.jpg' },
    { id: '4', title: 'パートナー募集', href: '/service/partner', description: 'パートナーを募集しています', image: 'https://i.pinimg.com/736x/55/92/d3/5592d36c450bcf881cea45c15c9f8ceb.jpg' },
    { id: '5', title: 'ランキング', description: '今週のランキングは？', image: 'https://i.pinimg.com/736x/d1/53/68/d15368e0ac60820d395db1b90a95ff11.jpg' },
  ];
  const quickList = [
    { id: '1', name: '揚物', image: '/assets/img/agemono.png' },
    { id: '2', name: '麺類', image: '/assets/img/men.png' },
    { id: '3', name: '野菜系', image: '/assets/img/vegetable.png' },
    { id: '4', name: '韓国風', image: '/assets/img/korean.png' },
    { id: '5', name: '魚介系', image: '/assets/img/fish.png' },
    { id: '6', name: '肉系', image: '/assets/img/meat.png' },
  ];

  return (
    <article className="home">
      <section className="container">
        <div className="dashboard">
          {hasLogin ?
            <div>
              マイポイント 4P
            </div>
            :
            <div>
              マイポイント 4P
            </div>
          }
          {hasLogin ?
            <button className="user-code-btn">
              会員コード
              <QrCodeScannerTwoToneIcon />
            </button>
            :
            <button className="login-btn" onClick={() => setHasLogin(true)}>
              ログイン
            </button>
          }
        </div>
      </section>
      <EventSlider events={events} />
      <section className="container">
        <div className="quick-select">
          <h2 className="title">
            今日の気分は？
          </h2>
          <div className="quick-select-wrapper">
            {quickList.map((item, index) => (
              <button
                key={index}
                className="quick-select-btn"
              >
                <Image
                  className="quick-select-image"
                  src={item.image}
                  alt={item.name}
                  width={100}
                  height={100}
                />
                <div className="quick-select-name">
                  {item.name}
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>
      <section className="container">
        <FoodCardSlider
          title="おすすめの弁当"
          data={foods}
        />
        <FoodCardSlider
          title="今話題の弁当"
          data={foods}
        />
      </section>
      <hr className="container" />
      <section className="container">
        <div className="introduction">
          <h2 className="title">ヒルクルのご紹介</h2>
          <p className="description">
            ヒルクルは現在、福岡市内限定でサービスを提供しておりますが、今後は全国展開を目指しております。<br/>
            私たちはランチをもっとラクに、そして余裕のある時間として楽しめるように取り組んでいます。
          </p>
          <div className="link-wrapper">
            <Link href="/service/contact">
              お問い合わせ
              <KeyboardArrowRightTwoToneIcon />
            </Link>
            <Link href="/service/partner">
              パートナー登録
              <KeyboardArrowRightTwoToneIcon />
            </Link>
          </div>
        </div>
      </section>
    </article>
  );
}
