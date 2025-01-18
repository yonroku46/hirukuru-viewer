"use client";

import MuiBreadcrumbs from "@/components/mui/MuiBreadcrumbs";

export default function ServiceContactPage() {
  const breadcrumbs: Breadcrumb[] = [
    { label: 'サービス', href: '/service' },
    { label: 'パートナー申請', href: '/service/partner', active: true },
  ];

  return (
    <div className="service container">
      <MuiBreadcrumbs breadcrumbs={breadcrumbs} />
    </div>
  );
}