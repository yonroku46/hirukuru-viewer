import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";

interface MuiBreadcrumbsProps {
  breadcrumbs: Breadcrumb[];
}

export default function MuiBreadcrumbs({ breadcrumbs}: MuiBreadcrumbsProps) {
  return (
    <div role="presentation" className="breadcrumbs">
      <Breadcrumbs aria-label="breadcrumb">
        {breadcrumbs.map((breadcrumb, index) => (
          <Link
            key={index}
            underline={breadcrumb.active ? "none" : "hover"}
            color={breadcrumb.active ? "text.primary" : "inherit"}
            href={breadcrumb.active ? undefined : breadcrumb.href}
          >
            {breadcrumb.label}
          </Link>
        ))}
      </Breadcrumbs>
    </div>
  );
}
