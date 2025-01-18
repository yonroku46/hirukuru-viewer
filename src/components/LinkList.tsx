"use client";

import React from "react";
import { useMediaQuery } from 'react-responsive';
import Link from "next/link";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

interface LinkListProps {
  title: string;
  linkList: LinkItem[];
}

export default function LinkList({ title, linkList }: LinkListProps) {
  const isSp = useMediaQuery({ query: "(max-width: 1179px)" });

  return (
    <div className="link-list">
      <h2 className="title">
        {title}
      </h2>
      <div className="link-list-items">
        {linkList.map((link, index) => (
          <Link
            key={index}
            href={link.href}
            className={`link-list-item ${link.disabled ? 'disabled' : ''}`}
          >
            <div className="link-list-item-content">
              <div className="icon-wrapper">
                {link.icon}
              </div>
              <p>{link.title}</p>
            </div>
            <KeyboardArrowRightIcon className="arrow-icon" />
          </Link>
        ))}
        {!isSp && linkList.length % 2 !== 0 && (
          <div className="link-list-item dummy" />
        )}
      </div>
    </div>
  );
}
