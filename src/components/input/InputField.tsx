"use client";

import React from "react";

interface InputFieldProps {
  type: React.HTMLInputTypeAttribute | 'textarea';
  value: string;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  required?: boolean;
  rows?: number;
}

export default function InputField({ type, value, placeholder, onChange, required, rows }: InputFieldProps) {
  return type === 'textarea' ? (
    <textarea
      className="input-field"
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      required={required}
      rows={rows}
    />
  ) : (
    <input
      className="input-field"
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      required={required}
    />
  );
};