import React, { useState } from "react";
import { useHistory } from "react-router-dom";

import Web from "./Web";
import Mobile from "./Mobile";
import { GiHamburgerMenu } from "react-icons/gi";
import classes from "./Header.module.css";

function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const history = useHistory();

  return (
    <div className={classes.header}>
      <h3 className={classes.logo} onClick={() => history.replace("/")}>
        Devconnect
      </h3>
      <div className={classes.menu}>
        <div className={classes.webMenu}>
          <Web />
        </div>
        <div className={classes.mobileMenu}>
          <div onClick={() => setIsOpen(!isOpen)}>
            <GiHamburgerMenu size={24} className={classes.hamburgerIcon} />
          </div>
          {isOpen && <Mobile isOpen={isOpen} setIsOpen={setIsOpen} />}
        </div>
      </div>
    </div>
  );
}

export default Header;
