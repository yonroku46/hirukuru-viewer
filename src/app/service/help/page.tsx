"use client";

import MuiBreadcrumbs from "@/components/mui/MuiBreadcrumbs";

export default function ServiceHelpPage() {
  const breadcrumbs: Breadcrumb[] = [
    { label: 'サービス', href: '/service' },
    { label: '利用ガイド', href: '/service/help', active: true },
  ];

  return (
    <div className="service container">
      <MuiBreadcrumbs breadcrumbs={breadcrumbs} />
    </div>
  );
}