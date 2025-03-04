"use client";

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import InsightsOutlinedIcon from '@mui/icons-material/InsightsOutlined';
import AddBusinessOutlinedIcon from '@mui/icons-material/AddBusinessOutlined';
import ThumbUpOffAltOutlinedIcon from '@mui/icons-material/ThumbUpOffAltOutlined';
import LocalDiningOutlinedIcon from '@mui/icons-material/LocalDiningOutlined';
import TaskAltOutlinedIcon from '@mui/icons-material/TaskAltOutlined';
import AlarmOnRoundedIcon from '@mui/icons-material/AlarmOnRounded';
import CloseIcon from '@mui/icons-material/Close';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

export default function ServicePage() {
  const router = useRouter();

  const importantSectionRef = useRef<HTMLDivElement | null>(null);

  const handleServiceClick = () => {
    router.push('/search/map');
  };

  const handleScrollToImportantSection = () => {
    if (importantSectionRef.current) {
      const fontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
      const headerHeightRem = getComputedStyle(document.documentElement).getPropertyValue('--header-height');
      const headerHeightPx =  parseFloat(headerHeightRem) * fontSize;
      const offsetTop = importantSectionRef.current.offsetTop - headerHeightPx;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth',
      });
    }
  };

  const serviceItems = [
    { title: 'お問い合わせ', description: '皆さんのご意見をお聞かせください', href: '/service/contact' },
    { title: 'パートナー申請', description: 'パートナーを募集しています', href: '/service/partner' },
    { title: 'お知らせ', description: 'お得な情報をお届けします', href: '/service/notice' },
    { title: '利用ガイド', description: '初めての方はこちらから', href: '/service/help' },
  ];

  const sellerBenefits = [
    { icon: InsightsOutlinedIcon, title: "集客効果", description: "ヒルクルを通じて、より多くの顧客に到達し、売上を増加させることができます。"  },
    { icon: AddBusinessOutlinedIcon, title: "在庫管理", description: "シンプルな管理システムを通じて、注文および在庫管理を効率的に行うことができます。"  },
    { icon: ThumbUpOffAltOutlinedIcon, title: "フォローアップ", description: "購入者とのコミュニケーションを通じて、フォローアップを行い、顧客満足度を高めることができます。" }
  ];

  const buyerBenefits = [
    { icon: LocalDiningOutlinedIcon, title: "選ぶ楽しさ", description: "様々なランチ弁当を一目で確認し、選択肢を広げることができます。"  },
    { icon: TaskAltOutlinedIcon, title: "圧倒的コスパ", description: "事前注文で食事を便利で効率的に食べれます。さらに食べるたびにポイントを還元。"  },
    { icon: AlarmOnRoundedIcon, title: "余裕のある時間", description: "好きな時間を指定して注文することで、余裕のある時間を過ごすことができます。" }
  ];

  const serviceSteps = [
    { time: "~11:50", prev: "ランチメニューの悩み", now: "事前予約\nor\n選び・注文" },
    { time: "12:00", prev: "ランチタイム\n開始", now: "ランチタイム\n開始" },
    { time: "12:10", prev: "販売場所移動", now: "近くで受け取り\n食事開始" },
    { time: "12:20", prev: "ランチ選び\n&\n注文/待機", now: undefined },
    { time: "12:30", prev: "受け取り\n食事開始", now: "食事終了\n&\n余裕時間" },
    { time: "12:40", prev: undefined, now: undefined },
    { time: "12:50", prev: "食事終了\n&\n余裕時間", now: undefined },
    { time: "13:00", prev: "ランチタイム\n終了", now: "ランチタイム\n終了" },
    { time: "余裕時間", prev: "約15分", now: "約30分" },
  ];

  const usageCards = [
    { title: "商品を選ぶ", description: "好みに合わせて商品を選ぶ", img: "/assets/img/usage-select.png" },
    { title: "注文・決済", description: "アプリ内で商品の注文から決済まで完了", img: "/assets/img/usage-order.png" },
    { title: "店頭で受け取り", description: "指定時間に店舗へ行き商品を受け取るだけ", img: "/assets/img/usage-takeout.png" },
  ];

  const serviceFunctions = [
    { title: "マップ検索", backgroundColor: "#003366",
      img: "/assets/img/func-search.png", description: "お店の位置とメニュー情報をリアルタイムで共有してお互いによりよい環境を提供" },
    { title: "事前予約", backgroundColor: "#FF6600",
      img: "/assets/img/func-reserve.png", description: "食事を予約することでよりお得に、素早く受け取り・販売が可能" },
    { title: "ポイント", backgroundColor: "#009688",
      img: "/assets/img/func-point.png", description: "食べるたびにポイントを貯めて次回のランチをもっとお得に" },
    { title: "データ提供", backgroundColor: "#5D4037",
      img: "/assets/img/func-data.png", description: "販売・購入したデータを提供。活用方法は人それぞれ" },
  ];

  const serviceImportantLists = [
    "複雑なシステム導入",
    "運営・維持コスト",
    "難しい操作",
    "その他同意のない条件強要",
  ]

  return (
    <article>
      {/* Service Header */}
      <div className="service-header">
        <div className="container">
          <div className="service-main-wrapper">
              <div className="left-wrapper">
                <p className="service-description">
                  ランチをスマートに
                </p>
                <h1 className="service-name">
                  ヒルクル
                </h1>
                <div className="service-btn-wrapper">
                  <button className="service-btn" onClick={handleServiceClick}>
                    無料ではじめる
                  </button>
                  <button className="intro-btn" onClick={handleScrollToImportantSection}>
                    パートナー申請はこちら
                  </button>
                </div>
              </div>
              <div className="right-wrapper" />
          </div>
        </div>
      </div>
      {/* Service Info */}
      <div className="service container">
        <div className="service-page">
          <div className="service-intro-wrapper">
            {/* Service Intro - Title */}
            <div className="service-title">
              <h3 className="title">
                ヒルクルとは？
              </h3>
              <p className="description">
                {`販売者との購入者を繋げて食事時間をより\n充実させるためのテイクアウト仲介サービスです`}
              </p>
            </div>
            <div className='service-benefit'>
              <div className='benefit-card'>
                <div className='benefit-title'>
                  <div className='text'>
                    販売者のメリット
                  </div>
                </div>
                {sellerBenefits.map((benefit, index) => (
                  <div key={index} className='card-item'>
                    <benefit.icon className='icon' />
                    <div className='title'>
                      {benefit.title}
                    </div>
                    <div className='description'>
                      {benefit.description}
                    </div>
                  </div>
                ))}
              </div>
              <div className='benefit-card'>
                <div className='benefit-title'>
                  <div className='text'>
                    購入者のメリット
                  </div>
                </div>
                {buyerBenefits.map((benefit, index) => (
                  <div key={index} className='card-item'>
                    <benefit.icon className='icon' />
                    <div className='title'>
                      {benefit.title}
                    </div>
                    <div className='description'>
                      {benefit.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Service Intro - Step */}
            <div className="service-title">
              <h3 className="title">
                サービスの流れ
              </h3>
              <p className="description">
                イメージして比較してみましょう
              </p>
            </div>
            <div className="service-step">
              <table className='service-step-table'>
                <thead>
                  <tr>
                    <th>時間</th>
                    <th className='prev'>従来の食事タイム</th>
                    <th className='now'>ヒルクル</th>
                  </tr>
                </thead>
                <tbody>
                  {serviceSteps.map((step, index) => (
                    <tr key={index}>
                      <td>{step.time}</td>
                      <td className='prev'>
                        {step.prev || <KeyboardArrowDownIcon />}
                      </td>
                      <td className='now'>
                        {step.now || <KeyboardArrowDownIcon />}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Service Intro - Usage */}
            <div className="service-title">
              <h3 className="title">
                ヒルクルの使い方
              </h3>
              <p className="description">
                {`近いお店を探してカンタンに注文・決済\nあとはお店で受け取るだけ！`}
              </p>
            </div>
            <div className="service-usage">
              {usageCards.map((card, index) => (
                <>
                  <div key={index} className="usage-card">
                    <div className="title-wrapper">
                      <div className="title">
                        {card.title}
                      </div>
                      <Image
                        src={card.img}
                        alt={card.title}
                        width={110}
                        height={110}
                      />
                    </div>
                    <div className="description">
                      {card.description}
                    </div>
                  </div>
                  {index < usageCards.length - 1 && (
                    <ArrowRightIcon className="usage-card-arrow" />
                  )}
                </>
              ))}
            </div>
            {/* Service Intro - Function */}
            <div className="service-title">
              <h3 className="title">
                こんな機能があります
              </h3>
              <p className="description">
                貴重なランチタイムをより充実させるために！
              </p>
            </div>
            <div className="service-function">
              {serviceFunctions.map((func, index) => (
                <div key={index} className="function-card" style={{ backgroundColor: func.backgroundColor }}>
                  <h4 className="function-card-title">
                    {func.title}
                  </h4>
                  <div className="function-card-description">
                    {func.description}
                  </div>
                  <Image
                    className="function-card-image"
                    src={func.img}
                    alt={func.title}
                    width={200}
                    height={200}
                  />
                </div>
              ))}
            </div>
            {/* Service Intro - Important */}
            <div ref={importantSectionRef} className="service-title">
              <h3 className="title">
                一緒に始めませんか？
              </h3>
              <p className="description">
                {`サービス導入に必要なのは\nネット環境とスマホだけ`}
              </p>
            </div>
            <div className="service-important">
              <div className='left-container'>
                {serviceImportantLists.map((list, index) => (
                  <div key={index} className='important-card'>
                    {list}
                    <CloseIcon className='icon' />
                  </div>
                ))}
              </div>
              <div className='right-container'>
                <div className='title'>
                  導入・運営負担ゼロ！
                  <span className='notice'>{"(※1, 2)"}</span>
                </div>
                <div className='description'>
                  {`※1：導入後は運営をサポートする形で提供いたします\n※2：販売されば分の一定の割合のみ頂いております`}
                </div>
              </div>
            </div>
            <div className='service-action-wrapper'>
              <Link href='/search/map' className='service-action-btn search'>
                近くの店舗を探す
              </Link>
              <Link href='/service/partner' className='service-action-btn partner'>
                導入を検討・申請
              </Link>
            </div>
          </div>
        </div>
      </div>
      {/* Service Footer */}
      <div className='service-footer'>
        <div className='container'>
          <div className="service-link-wrapper">
            {serviceItems.map((item, index) => (
              <Link key={index} href={item.href} className="service-link-item">
                <h2 className="name">{item.title}</h2>
                <p className="description">{item.description}</p>
                <ArrowForwardIcon className="arrow-icon" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}