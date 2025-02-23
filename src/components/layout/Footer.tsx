import { config } from "@/config";
import Link from "next/link";
import { dateNow } from "@/common/utils/DateUtils";

import XIcon from '@mui/icons-material/X';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';

const menuItems: GroupMenuItem[] = [
  { groupName: "注文", groupHref: "/search", groupItems: [
    { name: "店舗検索", href: "/search/map" },
    { name: "ランキング", href: "/search/ranking" },
  ]},
  { groupName: "サービス", groupHref: "/service", groupItems: [
    { name: "サービス紹介", href: "/service" },
    { name: "お問い合わせ", href: "/service/contact" },
    { name: "パートナー申請", href: "/service/partner" },
    { name: "お知らせ", href: "/service/notice" },
    { name: "利用ガイド", href: "/service/help" },
  ]},
];

const snsItems = [
  { icon: <XIcon />, href: "https://x.com/hirukuru_jp" },
  { icon: <InstagramIcon />, href: "https://www.instagram.com/hirukuru_jp/" },
  { icon: <FacebookIcon />, href: "https://www.facebook.com/hirukuru.jp" },
];

const policyItems = [
  { name: "利用規約", href: "/service/terms" },
  { name: "会社概要", href: "/service/company" },
  { name: "プライバシーポリシー", href: "/service/privacy" },
];

export default function Footer() {
  return (
    <footer>
      <div className="container top-container">
        <div className="left-container">
          <div className="logo">
            Hirukuru
            <div className="description">
              ランチをスマートに
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
          {snsItems.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.icon}
            </Link>
          ))}
        </div>
        <div className="policy">
          {policyItems.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.name}
            </Link>
          ))}
        </div>
      </div>
      <div className="copyright">
        © {config.service.copyright} {dateNow().year()}
      </div>
    </footer>
  );
};
