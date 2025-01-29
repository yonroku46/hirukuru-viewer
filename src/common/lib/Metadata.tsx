import { Metadata } from "next";
import { config } from "@/config";
import { signOgImageUrl } from "@/common/lib/OgImage";

type MetadataType = "home" | "login" | "signup" |
                    "my" | "my/order" | "my/favorite" | "my/point" | "my/coupon" | "my/order/review" |
                    "service" | "service/contact" | "service/partner" | "service/notice" | "service/help" |
                    "shop" | "search";

export async function generatePageMetadata(type: MetadataType, name?: string): Promise<Metadata> {
  const baseMetadata: Metadata = {
    metadataBase: new URL(config.baseUrl || ""),
    title: {
      template: config.service.metadata.title.template,
      default: config.service.metadata.title.default,
    },
    description: config.service.metadata.description,
    keywords: config.service.metadata.keywords.split(","),
    authors: [{ name: "Univus Inc." }],
    creator: "Univus Inc.",
    publisher: "Univus Inc.",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    openGraph: {
      type: "website",
      siteName: config.service.name,
      title: {
        template: config.service.metadata.title.template,
        default: config.service.metadata.title.default,
      },
      description: config.service.metadata.description,
      locale: "ja",
      images: [
        signOgImageUrl({
          title: config.service.name,
        }),
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: {
        template: config.service.metadata.title.template,
        default: config.service.metadata.title.default,
      },
      description: config.service.metadata.description,
      images: [
        signOgImageUrl({
          title: config.service.name,
        }),
      ],
      creator: "@univus",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    icons: {
      icon: [
        { url: "/assets/icon/favicon.ico" },
        { url: "/assets/icon/favicon.svg", type: "image/svg+xml" }
      ],
      apple: [
        { url: "/assets/icon/apple-touch-icon.png" }
      ],
    },
    manifest: "/manifest.json"
  };

  const pageMetadata: Record<MetadataType, Metadata> = {
    "home": {
      ...baseMetadata,
      title: `${config.service.name}`,
    },
    "login": {
      ...baseMetadata,
      title: `ログイン | ${config.service.name}`,
    },
    "signup": {
      ...baseMetadata,
      title: `新規登録 | ${config.service.name}`,
    },
    "my": {
      ...baseMetadata,
      title: `マイページ | ${config.service.name}`,
    },
    "my/order": {
      ...baseMetadata,
      title: `注文管理 | ${config.service.name}`,
    },
    "my/order/review": {
      ...baseMetadata,
      title: `レビュー | ${config.service.name}`,
    },
    "my/favorite": {
      ...baseMetadata,
      title: `お気に入り | ${config.service.name}`,
    },
    "my/point": {
      ...baseMetadata,
      title: `ポイント | ${config.service.name}`,
    },
    "my/coupon": {
      ...baseMetadata,
      title: `クーポン | ${config.service.name}`,
    },
    "search": {
      ...baseMetadata,
      title: `検索 | ${config.service.name}`,
    },
    "shop": {
      ...baseMetadata,
      title: `${name || '店舗'} | ${config.service.name}`,
    },
    "service": {
      ...baseMetadata,
      title: `サービス | ${config.service.name}`,
    },
    "service/contact": {
      ...baseMetadata,
      title: `お問い合わせ | ${config.service.name}`,
    },
    "service/partner": {
      ...baseMetadata,
      title: `パートナー申請 | ${config.service.name}`,
    },
    "service/notice": {
      ...baseMetadata,
      title: `お知らせ | ${config.service.name}`,
    },
    "service/help": {
      ...baseMetadata,
      title: `利用ガイド | ${config.service.name}`,
    },
  };

  return pageMetadata[type];
}