import React from "react";

const Unauthorized = () => {
  return (
    <div>
      you're not authorized for access to this page{" "}
      <a href="/" style={{ textDecoration: "underline" }}>
        back
      </a>
    </div>
  );
};

export default Unauthorized;
