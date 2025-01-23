import { config } from "@/config";
import Link from "next/link";

import XIcon from '@mui/icons-material/X';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';

const menuItems: GroupMenuItem[] = [
  { groupName: "注文", groupHref: "/search", groupItems: [
    { name: "弁当/店舗検索", href: "/search/map" },
    { name: "ランキング", href: "/search/ranking" },
  ]},
  { groupName: "サービス", groupHref: "/service", groupItems: [
    { name: "お問い合わせ", href: "/service/contact" },
    { name: "パートナー申請", href: "/service/partner" },
    { name: "お知らせ", href: "/service/notice" },
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
              ランチをラクに、余裕のある時間へ
            </div>
          </div>
        </div>
        <div className="right-container">
          <nav className="footer-nav">
            {menuItems.map((group) => (
              <div key={group.groupName}>
                <div className="group-name">
                  {group.groupName}
                </div>
                {group.groupItems.map((item) => (
                  <div className="group-item" key={item.name}>
                    <Link href={item.href}>
                      {item.name}
                    </Link>
                  </div>
                ))}
              </div>
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
