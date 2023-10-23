import React, { useState } from "react";
import Button from "./Button";

/* Component Composition */
const Box = ({ children }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="box">
      <Button onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </Button>

      {isOpen && children}
    </div>
  );
};

/*   Option 2
const Box = ({ element }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="box">
      <Button onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </Button>

      {isOpen && element}
    </div>
  );
};
*/

export default Box;
