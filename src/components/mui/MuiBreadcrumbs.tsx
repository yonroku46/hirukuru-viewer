import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";

import NavigateNextIcon from '@mui/icons-material/NavigateNext';

interface MuiBreadcrumbsProps {
  breadcrumbs: Breadcrumb[];
}

export default function MuiBreadcrumbs({ breadcrumbs}: MuiBreadcrumbsProps) {
  return (
    <div role="presentation" className="breadcrumbs">
      <div className="container">
        <Breadcrumbs
          aria-label="breadcrumb"
          separator={<NavigateNextIcon fontSize="inherit" />}
        >
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
    </div>
  );
}
