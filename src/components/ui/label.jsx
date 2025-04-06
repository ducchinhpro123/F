// src/components/ui/label.js
import React from "react";

export const Label = ({ htmlFor, children, ...props }) => {
  return (
    <label htmlFor={htmlFor} {...props}>
      {children}
    </label>
  );
};