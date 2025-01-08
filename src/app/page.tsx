"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { currency } from "@/common/utils/StringUtils";
import EventSlider from "@/components/EventSlider";
import FoodCardSlider from "@/components/FoodCardSlider";
import Selecter from "@/components/Selecter";

import KeyboardArrowRightTwoToneIcon from '@mui/icons-material/KeyboardArrowRightTwoTone';
import QrCodeScannerTwoToneIcon from '@mui/icons-material/QrCodeScannerTwoTone';
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import CellTowerSharpIcon from '@mui/icons-material/CellTowerSharp';

export default function Home() {
  const foods = [
    { id: '1', shopId: 'fuk001', category: '日替わり弁当', name: '唐揚げ弁当', description: "国内産の鶏肉を使用した唐揚げ弁当です。", ingredients: ["唐揚げ", "ほうれん草ナムル", "白ごはん"], price: 1000, discountPrice: 950, rating: 4.3, image: 'https://i.pinimg.com/736x/f2/67/df/f267dfdd2b0cb8eac4b5e9674aa49e97.jpg' },
    { id: '2', shopId: 'fuk001', category: '特製弁当', name: '特製のり弁', description: "特製のり弁です。", price: 500, discountPrice: 450, rating: 4.5, image: 'https://i.pinimg.com/736x/d2/bb/52/d2bb52d3639b77f024c8b5a584949644.jpg' },
    { id: '3', shopId: 'fuk001', category: '特製弁当', name: 'チキン南蛮弁当', price: 750, rating: 3.9, image: 'https://i.pinimg.com/236x/42/d7/59/42d7590255cfd29e56db2b3d968419d4.jpg' },
    { id: '4', shopId: 'fuk001', category: '特製弁当', name: 'カレー弁当', price: 550, rating: undefined, image: 'https://i.pinimg.com/236x/3b/4f/0a/3b4f0a758df2243b72d1d4985cda5437.jpg' },
    { id: '5', shopId: 'fuk001', category: '定番弁当', name: '塩鮭弁当', price: 550, rating: undefined, image: 'https://i.pinimg.com/736x/53/c1/4c/53c14c49208435da8fca89f4dae85cb4.jpg' },
    { id: '6', shopId: 'fuk001', category: '定番弁当', name: 'ナポリタン', price: 750, rating: 3.9, image: 'https://i.pinimg.com/736x/a0/44/3e/a0443eb63b9e4e56d4bdad82079d11be.jpg' },
    { id: '7', shopId: 'fuk001', category: '定番弁当', name: 'ビビンバ', price: 500, rating: 4.5, image: 'https://i.pinimg.com/736x/15/fc/18/15fc1800352f40dc57aba529365dd6dd.jpg' },
    { id: '8', shopId: 'fuk001', category: '定番弁当', name: '鶏そぼろ丼', price: 1000, rating: 4.3, image: 'https://i.pinimg.com/736x/a3/c0/44/a3c0445cb7ce8a623f9420a2aaa8332c.jpg' },
    { id: '9', shopId: 'fuk001', category: '定番弁当', name: 'ソースカツ弁当', price: 1000, rating: 4.3, image: 'https://i.pinimg.com/736x/09/cc/18/09cc18f3ab7aeb70638f33170251bceb.jpg' },
    { id: '10', shopId: 'fuk001', category: '定番弁当', name: 'カツカレー', price: 1000, rating: 4.3, image: 'https://i.pinimg.com/736x/7f/6f/55/7f6f5560ca41e1870c59b18f6f1f2360.jpg' },
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
    { id: '3', name: 'カレー', image: '/assets/img/curry.png' },
    { id: '4', name: '野菜系', image: '/assets/img/vegetable.png' },
    { id: '5', name: '韓国風', image: '/assets/img/korean.png' },
    { id: '6', name: '魚介系', image: '/assets/img/fish.png' },
    { id: '7', name: '肉系', image: '/assets/img/meat.png' },
  ];
  const locationOptions = useMemo(() => [
    { label: '福岡市 博多区', value: 'fukuoka-hakata' },
    { label: '福岡市 中央区', value: 'fukuoka-chuo' },
  ], []);

  const [hasLogin, setHasLogin] = useState<boolean>(false);
  const [location, setLocation] = useState<string>(locationOptions[0].value);
  const [locationLabel, setLocationLabel] = useState<string>(locationOptions[0].label);

  useEffect(() => {
    setLocationLabel(locationOptions.find(option => option.value===location)?.label.replace('福岡市 ', '') || '');
  }, [location, locationOptions]);

  return (
    <article className="home">
      <section className="container">
        <div className="home-wrapper">
          <div className="user-contents">
            <CellTowerSharpIcon className="location-icon" />
            {hasLogin ?
              <div className="user-dashboard">
                <div className="user-point">
                  マイポイント
                  <div className="point-value">
                    {currency(1000)}
                    <span className="unit">p</span>
                  </div>
                </div>
                <IconButton className="user-code-btn">
                  <QrCodeScannerTwoToneIcon />
                  会員コード
                </IconButton>
              </div>
              :
              <div className="user-dashboard">
                <Selecter
                  options={locationOptions}
                  onChange={(e) => setLocation(e.target.value)}
                />
                <Button className="user-login-btn" onClick={() => setHasLogin(true)}>
                  ログイン
                </Button>
              </div>
            }
          </div>
          <div className="service-contents">
            <EventSlider events={events} />
          </div>
        </div>
      </section>
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
                  width={90}
                  height={90}
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
          title={`${locationLabel}のおすすめ弁当`}
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
