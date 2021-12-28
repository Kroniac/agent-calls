import React from 'react';

import { NavLink } from 'react-router-dom';

import Styles from './layout.module.scss';

function NavBar() {
  return (
    <nav className={Styles.navBarWrapper}>
      <div>Logo</div>
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
