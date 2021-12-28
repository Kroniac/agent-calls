import React from 'react';

import { NavLink } from 'react-router-dom';

import Styles from './layout.module.scss';

const LOGO_URL =
  'https://uploads-ssl.webflow.com/5fcb3bbf6fdac54bdd345a59/5fcb3bbf6fdac505ce345d09_prodigal%20white.svg';

function NavBar() {
  return (
    <nav className={Styles.navBarWrapper}>
      <div className={Styles.logoWrapper}>
        <div className={Styles.logo}>
          <img src={LOGO_URL} alt="Prodigal" />
        </div>
      </div>
      <div>
        <NavLink
          tabIndex={-1}
          activeClassName={Styles.navBarItemActive}
          exact
          to="/agent_calls"
          className={Styles.navBarItem}
        >
          Agent Calls
        </NavLink>
        <NavLink
          tabIndex={-1}
          activeClassName={Styles.navBarItemActive}
          to="/call_labels"
          className={Styles.navBarItem}
        >
          Call Labels
        </NavLink>
      </div>
    </nav>
  );
}

export default NavBar;
