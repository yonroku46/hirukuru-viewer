"use client";

import { useState, FormEvent, useMemo } from 'react';
import Link from 'next/link';
import Image from "next/image";
import Selector from '@/components/input/Selector';
import InputField from '@/components/input/InputField';
import MuiBreadcrumbs from "@/components/mui/MuiBreadcrumbs";
import NoticeBoard from '@/components/NoticeBoard';

export default function ServiceContactPage() {
  const breadcrumbs: Breadcrumb[] = [
    { label: 'サービス', href: '/service' },
    { label: 'パートナー申請', href: '/service/partner', active: true },
  ];

  const flowList = [
    '申請フォームに必要事項をご記入',
    '必要な書類のご提出',
    'データ登録待ち',
    'サービス導入・運営',
  ];

  const shopTypeList = useMemo(() => [
    { value: 'bento', label: '弁当販売(路上)' },
    { value: 'bento_shop', label: '弁当販売(店舗/納品)' },
    { value: 'food_truck', label: 'フードトラック' },
    { value: 'other', label: 'その他' },
  ], []);

  const [submitted, setSubmitted] = useState<boolean>(false);
  const [shopType, setShopType] = useState<string>(shopTypeList[0].value);
  const [mail, setMail] = useState<string>('');
  const [phoneNum, setPhoneNum] = useState<string | undefined>(undefined);
  const [shopName, setShopName] = useState<string>('');
  const [shopSize, setShopSize] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [firstName, setFirstName] = useState<string>('');
  const [contents, setContents] = useState<string>('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <article>
      <div className="service container">
        <MuiBreadcrumbs breadcrumbs={breadcrumbs} />
        <div className='partner-page'>
          <div className='main-message'>
            <div className='thanks partner'>
              {`Webで簡単！サービス導入・運営が永久無料！`}
            </div>
            <h1 className='title'>
              {`パートナー申請`}
            </h1>
            <p className='description'>
              {`「ヒルクル」にご興味いただき誠にありがとうございます。こちらは、パートナー申請フォームです。\n通常、2営業日以内に担当者からご連絡させていただきますので日中つながる連絡方法でご入力ください。`}
            </p>
            <p className='description'>
              {`サービスについて不明点や詳細を知りたいなどございましたら、まずは`}
              <Link  href='/service' className='service-btn'>
                サービス紹介
              </Link>
              {`からご覧ください。`}
            </p>
            <NoticeBoard
              title="申請から導入までの流れ"
              contents={flowList}
              numbering
            />
          </div>
          {submitted ? (
            <div className='format submitted'>
              <Image
                src='/assets/img/send.avif'
                alt='submitted'
                width={200}
                height={200}
              />
              <p className='submitted-text'>
                内容を担当者に送信しました
              </p>
              <Link href='/' className='home-btn'>
                ホームへ戻る
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="format">
              <div className='shop-group'>
                <div className='shop-group-item'>
                  <label>販売タイプ</label>
                  <Selector
                    options={shopTypeList}
                    defaultValue={shopType}
                    onChange={(e) => setShopType(e.target.value)}
                  />
                </div>
                <div className='shop-group-item'>
                  <label>規模（従業員数など）</label>
                  <InputField
                    type='text'
                    value={shopSize}
                    required
                    placeholder='1~10名'
                    onChange={(e) => setShopSize(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label>会社・店舗名</label>
                <InputField
                  type='text'
                  value={shopName}
                  required
                  placeholder='株式会社ヒルクル'
                  onChange={(e) => setShopName(e.target.value)}
                />
              </div>
              <div className='name-group'>
                <div className='name-group-item'>
                  <label>姓</label>
                  <InputField
                    type='text'
                    value={lastName}
                    required
                    placeholder='山田'
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
                <div className='name-group-item'>
                  <label>名</label>
                  <InputField
                    type='text'
                    value={firstName}
                    required
                    placeholder='太郎'
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label>メールアドレス</label>
                <InputField
                  type='email'
                  value={mail}
                  required
                  placeholder='example@example.com'
                  onChange={(e) => setMail(e.target.value)}
                />
              </div>
              <div>
                <label>電話番号</label>
                <InputField
                  type='tel'
                  value={phoneNum || ''}
                  placeholder='080-1234-5678'
                  onChange={(e) => setPhoneNum(e.target.value)}
                />
              </div>
              <div>
                <label>ご要望（任意）</label>
                <InputField
                  type='textarea'
                  value={contents}
                  placeholder='早めに導入したいなど'
                  onChange={(e) => setContents(e.target.value)}
                  rows={4}
                />
              </div>
              <button type='submit' className='submit-btn'>
                送信
              </button>
            </form>
          )}
        </div>
      </div>
    </article>
  );
}