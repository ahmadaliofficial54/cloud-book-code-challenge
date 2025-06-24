import React from "react";

const AuthCard = ({ children }) => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#eef3fd] to-[#e6ecfa]">
    <div className="w-full max-w-md rounded-2xl shadow-lg border-0 p-8 bg-white">
      {children}
    </div>
  </div>
);

export default AuthCard; 