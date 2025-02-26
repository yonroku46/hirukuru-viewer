import { Metadata } from "next";
import { config } from "@/config";
// import { signOgImageUrl } from "@/common/lib/OgImage";

type MetadataType = "home" | "login" | "signup" | "myshop" |
                    "my" | "my/order" | "my/favorite" | "my/point" | "my/coupon" | "my/order/review" |
                    "service" | "service/contact" | "service/partner" | "service/notice" | "service/help" | "service/privacy" | "service/terms" |
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
        `${config.baseUrl}/assets/img/og-image-1200x630.png`,
        // signOgImageUrl({
        //   title: config.service.name,
        // }),
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
        `${config.baseUrl}/assets/img/twitter-card-1200x600.png`,
        // signOgImageUrl({
        //   title: config.service.name,
        // }),
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
        { url: "/assets/icon/app/favicon.ico" },
        { url: "/assets/icon/app/favicon-16x16.png", sizes: "16x16", type: "image/png" },
        { url: "/assets/icon/app/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      ],
      apple: [
        { url: "/assets/icon/app/apple-touch-icon-120x120.png", sizes: "120x120" },
        { url: "/assets/icon/app/apple-touch-icon-152x152.png", sizes: "152x152" },
        { url: "/assets/icon/app/apple-touch-icon-167x167.png", sizes: "167x167" },
        { url: "/assets/icon/app/apple-touch-icon-180x180.png", sizes: "180x180" }
      ],
      other: [
        { url: "/assets/icon/app/icon-192x192.png", sizes: "192x192", type: "image/png" },
        { url: "/assets/icon/app/icon-512x512.png", sizes: "512x512", type: "image/png" }
      ]
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
      title: `ログイン - ${config.service.name}`,
    },
    "signup": {
      ...baseMetadata,
      title: `新規登録 - ${config.service.name}`,
    },
    "myshop": {
      ...baseMetadata,
      title: `店舗管理 - ${config.service.name}`,
    },
    "my": {
      ...baseMetadata,
      title: `マイページ - ${config.service.name}`,
    },
    "my/order": {
      ...baseMetadata,
      title: `注文管理 - ${config.service.name}`,
    },
    "my/order/review": {
      ...baseMetadata,
      title: `レビュー - ${config.service.name}`,
    },
    "my/favorite": {
      ...baseMetadata,
      title: `お気に入り - ${config.service.name}`,
    },
    "my/point": {
      ...baseMetadata,
      title: `ポイント - ${config.service.name}`,
    },
    "my/coupon": {
      ...baseMetadata,
      title: `クーポン - ${config.service.name}`,
    },
    "search": {
      ...baseMetadata,
      title: `検索 - ${config.service.name}`,
    },
    "shop": {
      ...baseMetadata,
      title: `${name || '店舗'} - ${config.service.name}`,
    },
    "service": {
      ...baseMetadata,
      title: `サービス - ${config.service.name}`,
    },
    "service/contact": {
      ...baseMetadata,
      title: `お問い合わせ - ${config.service.name}`,
    },
    "service/partner": {
      ...baseMetadata,
      title: `パートナー申請 - ${config.service.name}`,
    },
    "service/notice": {
      ...baseMetadata,
      title: `お知らせ - ${config.service.name}`,
    },
    "service/help": {
      ...baseMetadata,
      title: `利用ガイド - ${config.service.name}`,
    },
    "service/privacy": {
      ...baseMetadata,
      title: `プライバシーポリシー - ${config.service.name}`,
    },
    "service/terms": {
      ...baseMetadata,
      title: `利用規約 - ${config.service.name}`,
    },
  };

  return pageMetadata[type];
}