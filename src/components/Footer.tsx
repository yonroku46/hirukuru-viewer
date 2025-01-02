"use client";

import { config } from "@/config";
import Link from "next/link";

import XIcon from '@mui/icons-material/X';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';

const menuItems: GroupMenuItem[] = [
  { groupName: "注文", groupHref: "/bento", groupItems: [
    { name: "弁当/店舗検索", href: "/bento/search" },
    { name: "ランキング", href: "/bento/ranking" },
  ]},
  { groupName: "サービス", groupHref: "/service", groupItems: [
    { name: "お問い合わせ", href: "/service/contact" },
    { name: "パートナー登録", href: "/service/partner" },
    { name: "利用ガイド", href: "/service/help" },
  ]},
];

export default function Footer() {
  return (
    <footer>
      <div className="container top-container">
        <div className="left-container">
          <div className="logo">
            Hirukuru
            <div className="description">
              ランチをラクに、余裕を
            </div>
          </div>
        </div>
        <div className="right-container">
          <nav>
            {menuItems.map((item) => (
              item.groupItems.map((subItem, index) => (
                <Link key={index} href={subItem.href}>{subItem.name}</Link>
              ))
            ))}
          </nav>
        </div>
      </div>
      <div className="container bottom-container">
        <div className="sns">
          <Link href="https://x.com/hirukuru_jp"><XIcon /></Link>
          <Link href="https://www.instagram.com/hirukuru_jp/"><InstagramIcon /></Link>
          <Link href="https://www.facebook.com/hirukuru.jp"><FacebookIcon /></Link>
        </div>
        <div className="policy">
          <Link href="/service/terms">利用規約</Link>
          <Link href="/service/company">会社概要</Link>
          <Link href="/service/privacy">プライバシーポリシー</Link>
        </div>
      </div>
      <div className="copyright">
        © {config.service.copyright} {new Date().getFullYear()}
      </div>
    </footer>
  );
};
