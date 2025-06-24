import React from "react";
import { Button } from "antd";

const PrimaryButton = ({ children, className = "", ...props }) => (
  <Button
    type="primary"
    className={`h-12 rounded-lg text-base font-semibold bg-[#2563eb] border-[#2563eb] text-white hover:bg-white hover:text-[#2563eb] hover:border-[#2563eb] transition-all ${className}`}
    {...props}
  >
    {children}
  </Button>
);

export default PrimaryButton; 