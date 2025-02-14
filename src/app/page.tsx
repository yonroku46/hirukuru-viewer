import Link from "next/link";
import Image from "next/image";
import EventSlider from "@/components/EventSlider";
import ItemCardSlider from "@/components/ItemCardSlider";
import NewShopSlider from "@/components/NewShopSlider";
import Title from "@/components/layout/Title";

import KeyboardArrowRightTwoToneIcon from '@mui/icons-material/KeyboardArrowRightTwoTone';

export default function Home() {
  const items: ItemState[] = [
    { itemId: '1', shopId: 'fuk001', categoryName: '日替わり弁当', itemName: '唐揚げ弁当', itemDescription: "国内産の鶏肉を使用した唐揚げ弁当です。", itemPrice: 1000, itemOrder: 1, discountPrice: 950, ratingAvg: 4.3, thumbnailImg: 'https://i.pinimg.com/736x/f2/67/df/f267dfdd2b0cb8eac4b5e9674aa49e97.jpg' },
    { itemId: '2', shopId: 'fuk001', categoryName: '特製弁当', itemName: '特製のり弁', itemDescription: "特製のり弁です。", itemPrice: 500, itemOrder: 2, discountPrice: 450, ratingAvg: 4.5, thumbnailImg: 'https://i.pinimg.com/736x/d2/bb/52/d2bb52d3639b77f024c8b5a584949644.jpg' },
    { itemId: '3', shopId: 'fuk001', categoryName: '特製弁当', itemName: 'チキン南蛮弁当', itemPrice: 750, itemOrder: 3, ratingAvg: 3.9, thumbnailImg: 'https://i.pinimg.com/236x/42/d7/59/42d7590255cfd29e56db2b3d968419d4.jpg' },
    { itemId: '4', shopId: 'fuk001', categoryName: '特製弁当', itemName: 'カレー弁当', itemPrice: 550, itemOrder: 4, ratingAvg: undefined, thumbnailImg: 'https://i.pinimg.com/236x/3b/4f/0a/3b4f0a758df2243b72d1d4985cda5437.jpg' },
    { itemId: '5', shopId: 'fuk001', categoryName: '定番弁当', itemName: '塩鮭弁当', itemPrice: 550, itemOrder: 5, ratingAvg: undefined, thumbnailImg: 'https://i.pinimg.com/736x/53/c1/4c/53c14c49208435da8fca89f4dae85cb4.jpg' },
    { itemId: '6', shopId: 'fuk001', categoryName: '定番弁当', itemName: 'ナポリタン', itemPrice: 750, itemOrder: 6, ratingAvg: 3.9, thumbnailImg: 'https://i.pinimg.com/736x/a0/44/3e/a0443eb63b9e4e56d4bdad82079d11be.jpg' },
    { itemId: '7', shopId: 'fuk001', categoryName: '定番弁当', itemName: 'ビビンバ', itemPrice: 500, itemOrder: 7, ratingAvg: 4.5, thumbnailImg: 'https://i.pinimg.com/736x/15/fc/18/15fc1800352f40dc57aba529365dd6dd.jpg' },
    { itemId: '8', shopId: 'fuk001', categoryName: '定番弁当', itemName: '鶏そぼろ丼', itemPrice: 1000, itemOrder: 8, ratingAvg: 4.3, thumbnailImg: 'https://i.pinimg.com/736x/a3/c0/44/a3c0445cb7ce8a623f9420a2aaa8332c.jpg' },
    { itemId: '9', shopId: 'fuk001', categoryName: '定番弁当', itemName: 'ソースカツ弁当', itemPrice: 1000, itemOrder: 9, ratingAvg: 4.3, thumbnailImg: 'https://i.pinimg.com/736x/09/cc/18/09cc18f3ab7aeb70638f33170251bceb.jpg' },
    { itemId: '10', shopId: 'fuk001', categoryName: '定番弁当', itemName: 'カツカレー', itemPrice: 1000, itemOrder: 10, ratingAvg: 4.3, thumbnailImg: 'https://i.pinimg.com/736x/7f/6f/55/7f6f5560ca41e1870c59b18f6f1f2360.jpg' },
  ];
  const shops: Shop[] = [
    { shopId: 'fuk001', shopName: 'ヒルクル 福岡店', location: '福岡市中央区',
      shopIntro: 'ヒルクル福岡店は福岡市中央区天神2丁目1-1にあるお弁当屋さんです。',
      thumbnailImg: '/assets/img/new-open.png',
    } as Shop,
    { shopId: 'fuk002', shopName: 'ヒルクル 天神店', location: '福岡市中央区',
      shopIntro: 'ヒルクル福岡店は福岡市中央区天神2丁目1-1にあるお弁当屋さんです。',
      thumbnailImg: '/assets/img/new-open2.png',
    } as Shop,
    { shopId: 'fuk003', shopName: '唐揚げ壱番屋', location: '福岡市中央区',
      shopIntro: 'ヒルクル福岡店は福岡市中央区天神2丁目1-1にあるお弁当屋さんです。',
      thumbnailImg: '/assets/img/new-open.png',
    } as Shop,
    { shopId: 'fuk004', shopName: '弁当光', location: '福岡市中央区',
      shopIntro: 'ヒルクル福岡店は福岡市中央区天神2丁目1-1にあるお弁当屋さんです。',
      thumbnailImg: '/assets/img/new-open2.png',
    } as Shop,
  ];
  const events: ServiceNotice[] = [
    { noticeId: '1', noticeType: 'EVENT', noticeTitle: '謹賀新年', noticeDetail: '2025年もよろしくお願いします', thumbnailImg: 'https://i.pinimg.com/736x/f6/eb/1e/f6eb1e567a5b4827a9afb5195dcab446.jpg', createTime: '2025-01-01' },
    { noticeId: '2', noticeType: 'EVENT', noticeTitle: 'いつでもBack!', noticeDetail: '会員はいつでもポイントバックします', thumbnailImg: 'https://i.pinimg.com/736x/8f/05/4d/8f054d66b37f59a34fd878fc2e783087.jpg', createTime: '2025-01-01' },
    { noticeId: '3', noticeType: 'EVENT', noticeTitle: '初めてのガイド', noticeHref: '/service/help', noticeDetail: 'ヒルクルの使い方をご紹介します', thumbnailImg: 'https://i.pinimg.com/736x/19/f1/97/19f197e170d66608885cecb06326b8a7.jpg', createTime: '2025-01-01' },
    { noticeId: '4', noticeType: 'EVENT', noticeTitle: 'パートナー募集', noticeHref: '/service/partner', noticeDetail: 'パートナーを募集しています', thumbnailImg: 'https://i.pinimg.com/736x/75/d7/5b/75d75b4a87ea4a45b3dc78e8a30de06d.jpg', createTime: '2025-01-01' },
    { noticeId: '5', noticeType: 'EVENT', noticeTitle: 'ランキング', noticeDetail: '今週のランキングは？', thumbnailImg: 'https://i.pinimg.com/736x/c1/90/a8/c190a833901cfa35fd456012cb9c0f6d.jpg', createTime: '2025-01-01' },
  ];
  const quickList = [
    { id: '1', name: '揚物', imgIcon: '/assets/img/agemono.png' },
    { id: '2', name: '麺類', imgIcon: '/assets/img/men.png' },
    { id: '3', name: 'カレー', imgIcon: '/assets/img/curry.png' },
    { id: '4', name: '野菜', imgIcon: '/assets/img/vegetable.png' },
    { id: '5', name: '韓国風', imgIcon: '/assets/img/korean.png' },
    { id: '6', name: 'お魚', imgIcon: '/assets/img/fish.png' },
    { id: '7', name: 'お肉', imgIcon: '/assets/img/meat.png' },
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
          <Title
            title="今日の気分は？"
          />
          <div className="quick-select-wrapper">
            {quickList.map((item, index) => (
              <button
                key={index}
                className="quick-select-btn"
              >
                <Image
                  className="quick-select-image"
                  src={item.imgIcon}
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
        <ItemCardSlider
          title="近所のおすすめ弁当"
          data={items}
        />
        <ItemCardSlider
          title="今話題の弁当"
          data={items}
        />
      </section>
      <hr className="container" />
      <section className="container">
        <div className="introduction">
          <Title
            title="ヒルクルのご紹介"
          />
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
