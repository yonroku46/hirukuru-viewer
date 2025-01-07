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
      <label>{title}</label>
      <div className="link-list-items">
        {linkList.map((link, index) => (
          <Link
            key={index}
            href={link.href}
            className="link-list-item"
            style={{
              borderBottom: index === linkList.length - 1 ? 'none' : '1px solid var(--gray-alpha-300)',
            }}
          >
            <div className="link-list-item-content">
              {index}/{linkList.length - 1}
              {link.icon}
              {link.title}
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
