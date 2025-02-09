"use client";

import { useState, FormEvent, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from "next/image";
import Selector from '@/components/input/Selector';
import InputField from '@/components/input/InputField';
import MuiBreadcrumbs from "@/components/mui/MuiBreadcrumbs";
import PlatformService from '@/api/service/PlatformService';

interface InquirySelecter {
  value: ServiceInquiryType['type'];
  label: string;
  placeholder: string;
}

export default function ServiceContactPage() {
  const breadcrumbs: Breadcrumb[] = [
    { label: 'サービス', href: '/service' },
    { label: 'お問い合わせ', href: '/service/contact', active: true },
  ];

  const categoryList: InquirySelecter[] = useMemo(() => [
    { value: 'suggest', label: 'ご意見・ご要望', placeholder: 'ご意見内容を入力してください' },
    { value: 'bulk', label: '大量注文', placeholder: '注文(店舗名、商品名、数量、希望日等)を入力してください\nサービス担当者からのご案内の連絡をさせていただきます' },
    { value: 'inquiry', label: 'その他お問い合わせ', placeholder: 'お問い合わせ内容を入力してください' },
  ], []);

  const platformService = PlatformService();

  const [loading, setLoading] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [category, setCategory] = useState<ServiceInquiryType['type']>("suggest");
  const [mail, setMail] = useState<string>('');
  const [phoneNum, setPhoneNum] = useState<string | undefined>(undefined);
  const [contents, setContents] = useState<string>('');
  const [placeholderText, setPlaceholderText] = useState<string>('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const inquiry: ServiceInquiry = {
      inquiryType: category,
      mail: mail,
      phoneNum: phoneNum,
      inquiryDetail: contents,
    } as ServiceInquiry;
    setLoading(true);
    platformService.contactSubmit(inquiry).then((res) => {
      if (res) {
        setSubmitted(true);
      }
      setLoading(false);
    });
  };

  useEffect(() => {
    setLoading(false);
  }, []);

  useEffect(() => {
    setPlaceholderText(categoryList.find(item => item.value === category)?.placeholder || '');
  }, [category, categoryList]);

  return (
    <article>
      <div className="service container">
        <MuiBreadcrumbs breadcrumbs={breadcrumbs} />
        <div className='contact-page'>
          <div className='main-message'>
            <div className='thanks'>
              {`いつものご利用ありがとうございます✨`}
            </div>
            <h1 className='title'>
              {`お問い合わせ・大量注文`}
            </h1>
            <p className='description'>
              {`いただいたご質問・大量注文については\nできるだけ早くお返事させていただきます。`}
            </p>
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
              <div>
                <label>お問い合わせ内容</label>
                <Selector
                  options={categoryList}
                  defaultValue={category}
                  onChange={(e) => setCategory(e.target.value as ServiceInquiryType['type'])}
                />
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
                <label>詳細</label>
                <InputField
                  type='textarea'
                  value={contents}
                  required
                  placeholder={placeholderText}
                  onChange={(e) => setContents(e.target.value)}
                  rows={8}
                />
              </div>
              <button type='submit' className='submit-btn' disabled={loading}>
                {loading ? '送信中...' : '送信'}
              </button>
            </form>
          )}
        </div>
      </div>
    </article>
  );
}
