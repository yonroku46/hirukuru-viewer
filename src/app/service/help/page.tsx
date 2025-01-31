"use client";

import { useState } from "react";
import Link from "next/link";
import SearchInput from "@/components/input/SearchInput";
import MuiBreadcrumbs from "@/components/mui/MuiBreadcrumbs";

import { styled } from '@mui/material/styles';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionSummary, { AccordionSummaryProps, accordionSummaryClasses } from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ShoppingBasketOutlinedIcon from '@mui/icons-material/ShoppingBasketOutlined';
import TextsmsOutlinedIcon from '@mui/icons-material/TextsmsOutlined';
import ChangeCircleOutlinedIcon from '@mui/icons-material/ChangeCircleOutlined';
import CreditCardOutlinedIcon from '@mui/icons-material/CreditCardOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import SupportAgentOutlinedIcon from '@mui/icons-material/SupportAgentOutlined';

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(() => ({
  border: `1px solid var(--gray-alpha-500)`,
  borderRadius: '0.5rem',
  '&:not(:first-of-type)': {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  '&:not(:last-child)': {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderBottom: 0,
  },
  '&::before': {
    display: 'none',
  },
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '1rem' }} />}
    {...props}
  />
))(({ theme }) => ({
  paddingTop: '0.25rem',
  paddingBottom: '0.25rem',
  [`& .${accordionSummaryClasses.expandIconWrapper}.${accordionSummaryClasses.expanded}`]:
    {
      transform: 'rotate(90deg)',
    },
  [`& .${accordionSummaryClasses.content}`]: {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: '1px solid var(--gray-alpha-500)',
  backgroundColor: 'rgba(0, 0, 0, .03)',
}));

export default function ServiceHelpPage() {
  const breadcrumbs: Breadcrumb[] = [
    { label: 'サービス', href: '/service' },
    { label: '利用ガイド', href: '/service/help', active: true },
  ];

  const [searchValue, setSearchValue] = useState<string>("");
  const [expandItem, setExpandItem] = useState<number | undefined>(undefined);
  const handleExpandItem = (index: number) => {
    setExpandItem(expandItem === index ? undefined : index);
  };

  const helpCategoryList = [
    { icon: <ShoppingBasketOutlinedIcon />, label: '注文・受け取り', href: '/order' },
    { icon: <CreditCardOutlinedIcon />, label: 'お支払い・ポイント', href: '/payment' },
    { icon: <TextsmsOutlinedIcon />, label: 'レビュー', href: '/review' },
    { icon: <ChangeCircleOutlinedIcon />, label: '変更・キャンセル', href: '/change' },
    { icon: <SearchOutlinedIcon />, label: '検索', href: '/search' },
    { icon: <ShoppingCartOutlinedIcon />, label: 'カート', href: '/cart' },
    { icon: <StorefrontOutlinedIcon />, label: 'パートナー', href: '/partner' },
    { icon: <PersonOutlineOutlinedIcon />, label: 'アカウント', href: '/account' },
    { icon: <SupportAgentOutlinedIcon />, label: 'サービス', href: '/service' },
    { icon: <HelpOutlineIcon />, label: 'その他', href: '/other' },
  ];

  const helpQuestionList = [
    { question: 'Q : 質問', answer: '回答' },
    { question: 'Q : 質問', answer: '回答' },
    { question: 'Q : 質問', answer: '回答' },
    { question: 'Q : 質問', answer: '回答' },
    { question: 'Q : 質問', answer: '回答' },
  ];

  return (
    <article>
      <div className="background" />
      <div className="service container">
        <MuiBreadcrumbs breadcrumbs={breadcrumbs} />
        <div className="help-page">
          <div className="title-wrapper">
            <h1 className="title">
              利用ガイド
            </h1>
            <p className="description">
              サービスの利用でお困りごとがあればこちらからご確認ください
            </p>
          </div>
          <div className="search-wrapper">
            <SearchInput
              searchMode
              placeholder="ガイド内検索"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </div>
          <div className="help-wrapper">
            {/* Help Guide Button */}
            <div className="help-guide-wrapper">
              <button className="help-guide-btn">
                初めてのご利用ガイド
              </button>
              <button className="help-guide-btn">
                利用規約・ポリシー
              </button>
            </div>
            {/* Help Category */}
            <div className="help-category-wrapper">
              <h3>カテゴリーから探す</h3>
              <div className="category-list">
                {helpCategoryList.map((category, index) => (
                  <Link key={index} href={`/service/help${category.href}`} className="category-item">
                    {category.icon}
                    {category.label}
                  </Link>
                ))}
              </div>
            </div>
            {/* Help Question */}
            <div className="help-question-wrapper">
              <h3>よくあるご質問</h3>
              <div className="question-list">
                {helpQuestionList.map((question, index) => (
                  <Accordion
                    key={index}
                    expanded={expandItem === index}
                    onChange={() => handleExpandItem(index)}
                    >
                      <AccordionSummary>
                        <Typography component="span">
                          {question.question}
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Typography sx={{ whiteSpace: 'pre-wrap' }}>
                          {question.answer}
                        </Typography>
                      </AccordionDetails>
                  </Accordion>
                ))}
              </div>
            </div>
            {/* Help Contact */}
            <div className="help-contact-wrapper">
              <h3>上記で解決しない場合</h3>
              <p>記を確認してお困りごとが解決しなかった場合は、こちらよりお問い合わせください。</p>
              <Link href="/service/contact" className="contact-btn">
                お問い合わせはこちら
              </Link>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}