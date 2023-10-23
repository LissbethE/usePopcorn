import React from "react";

const Button = ({ onClick, children }) => {
  return (
    <button className="btn-toggle" onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
