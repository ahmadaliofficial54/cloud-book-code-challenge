import React from "react";
import { Button } from "antd";

const SecondaryButton = ({ children, className = "", ...props }) => (
  <Button
    type="default"
    className={`h-12 rounded-lg text-base font-semibold bg-white border-[#2563eb] text-[#2563eb] hover:bg-[#2563eb] hover:text-white hover:border-[#2563eb] transition-all ${className}`}
    {...props}
  >
    {children}
  </Button>
);

export default SecondaryButton; 