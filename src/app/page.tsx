import Link from "next/link";
import Image from "next/image";
import EventSlider from "@/components/EventSlider";
import FoodCardSlider from "@/components/FoodCardSlider";
import NewShopSlider from "@/components/NewShopSlider";

import KeyboardArrowRightTwoToneIcon from '@mui/icons-material/KeyboardArrowRightTwoTone';

export default function Home() {
  const foods = [
    { foodId: '1', shopId: 'fuk001', category: '日替わり弁当', name: '唐揚げ弁当', description: "国内産の鶏肉を使用した唐揚げ弁当です。", ingredients: ["唐揚げ", "ほうれん草ナムル", "白ごはん"], price: 1000, discountPrice: 950, rating: 4.3, image: 'https://i.pinimg.com/736x/f2/67/df/f267dfdd2b0cb8eac4b5e9674aa49e97.jpg' },
    { foodId: '2', shopId: 'fuk001', category: '特製弁当', name: '特製のり弁', description: "特製のり弁です。", price: 500, discountPrice: 450, rating: 4.5, image: 'https://i.pinimg.com/736x/d2/bb/52/d2bb52d3639b77f024c8b5a584949644.jpg' },
    { foodId: '3', shopId: 'fuk001', category: '特製弁当', name: 'チキン南蛮弁当', price: 750, rating: 3.9, image: 'https://i.pinimg.com/236x/42/d7/59/42d7590255cfd29e56db2b3d968419d4.jpg' },
    { foodId: '4', shopId: 'fuk001', category: '特製弁当', name: 'カレー弁当', price: 550, rating: undefined, image: 'https://i.pinimg.com/236x/3b/4f/0a/3b4f0a758df2243b72d1d4985cda5437.jpg' },
    { foodId: '5', shopId: 'fuk001', category: '定番弁当', name: '塩鮭弁当', price: 550, rating: undefined, image: 'https://i.pinimg.com/736x/53/c1/4c/53c14c49208435da8fca89f4dae85cb4.jpg' },
    { foodId: '6', shopId: 'fuk001', category: '定番弁当', name: 'ナポリタン', price: 750, rating: 3.9, image: 'https://i.pinimg.com/736x/a0/44/3e/a0443eb63b9e4e56d4bdad82079d11be.jpg' },
    { foodId: '7', shopId: 'fuk001', category: '定番弁当', name: 'ビビンバ', price: 500, rating: 4.5, image: 'https://i.pinimg.com/736x/15/fc/18/15fc1800352f40dc57aba529365dd6dd.jpg' },
    { foodId: '8', shopId: 'fuk001', category: '定番弁当', name: '鶏そぼろ丼', price: 1000, rating: 4.3, image: 'https://i.pinimg.com/736x/a3/c0/44/a3c0445cb7ce8a623f9420a2aaa8332c.jpg' },
    { foodId: '9', shopId: 'fuk001', category: '定番弁当', name: 'ソースカツ弁当', price: 1000, rating: 4.3, image: 'https://i.pinimg.com/736x/09/cc/18/09cc18f3ab7aeb70638f33170251bceb.jpg' },
    { foodId: '10', shopId: 'fuk001', category: '定番弁当', name: 'カツカレー', price: 1000, rating: 4.3, image: 'https://i.pinimg.com/736x/7f/6f/55/7f6f5560ca41e1870c59b18f6f1f2360.jpg' },
  ];
  const shops: Shop[] = [
    { shopId: 'fuk001', name: 'ヒルクル 福岡店', location: '福岡市中央区',
      description: 'ヒルクル福岡店は福岡市中央区天神2丁目1-1にあるお弁当屋さんです。',
    } as Shop,
    { shopId: 'fuk002', name: 'ヒルクル 天神店', location: '福岡市中央区',
      description: 'ヒルクル福岡店は福岡市中央区天神2丁目1-1にあるお弁当屋さんです。',
    } as Shop,
    { shopId: 'fuk003', name: '唐揚げ壱番屋', location: '福岡市中央区',
      description: 'ヒルクル福岡店は福岡市中央区天神2丁目1-1にあるお弁当屋さんです。',
    } as Shop,
    { shopId: 'fuk004', name: '弁当光', location: '福岡市中央区',
      description: 'ヒルクル福岡店は福岡市中央区天神2丁目1-1にあるお弁当屋さんです。',
    } as Shop,
];
  const events = [
    { eventId: '1', title: '謹賀新年', description: '2025年もよろしくお願いします', image: 'https://i.pinimg.com/736x/f6/eb/1e/f6eb1e567a5b4827a9afb5195dcab446.jpg' },
    { eventId: '2', title: 'いつでも3%Back!', description: '会員はいつでもポイントバックします', image: 'https://i.pinimg.com/736x/8f/05/4d/8f054d66b37f59a34fd878fc2e783087.jpg' },
    { eventId: '3', title: '初めてのガイド', href: '/service/help', description: 'ヒルクルの使い方をご紹介します', image: 'https://i.pinimg.com/736x/19/f1/97/19f197e170d66608885cecb06326b8a7.jpg' },
    { eventId: '4', title: 'パートナー募集', href: '/service/partner', description: 'パートナーを募集しています', image: 'https://i.pinimg.com/736x/75/d7/5b/75d75b4a87ea4a45b3dc78e8a30de06d.jpg' },
    { eventId: '5', title: 'ランキング', description: '今週のランキングは？', image: 'https://i.pinimg.com/736x/c1/90/a8/c190a833901cfa35fd456012cb9c0f6d.jpg' },
  ];
  const quickList = [
    { id: '1', name: '揚物', image: '/assets/img/agemono.png' },
    { id: '2', name: '麺類', image: '/assets/img/men.png' },
    { id: '3', name: 'カレー', image: '/assets/img/curry.png' },
    { id: '4', name: '野菜', image: '/assets/img/vegetable.png' },
    { id: '5', name: '韓国風', image: '/assets/img/korean.png' },
    { id: '6', name: 'お魚', image: '/assets/img/fish.png' },
    { id: '7', name: 'お肉', image: '/assets/img/meat.png' },
  ];

  return (
    <article className="home">
      <section className="container home-top">
        <div className="home-wrapper">
          <div className="service-contents">
            <EventSlider events={events} />
          </div>
          <div className="sub-contents">
            <NewShopSlider shops={shops} />
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
                  width={86}
                  height={86}
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
          title="近所のおすすめ弁当"
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
              パートナー申請
              <KeyboardArrowRightTwoToneIcon />
            </Link>
          </div>
        </div>
      </section>
    </article>
  );
}
