import React from "react";
import { Svgs } from "../Svgs/svg-icons";

const AuthLogo = () => (
  <div className="flex justify-center items-center mb-6">
    <span className="inline-flex items-center justify-center bg-[#eaf1fd] rounded-lg p-3">
      {/* Use the main logo or a book icon from Svgs */}
      <svg height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 38V10a2 2 0 0 1 2-2h13v32H10a2 2 0 0 1-2-2zm32 0V10a2 2 0 0 0-2-2H25v32h13a2 2 0 0 0 2-2z" stroke="#2563eb" strokeWidth="2.5" strokeLinejoin="round"/>
      </svg>
    </span>
  </div>
);

export default AuthLogo; 