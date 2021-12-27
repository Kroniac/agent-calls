import React, { useState } from 'react';

import { element } from 'prop-types';
import { AiOutlineSetting, AiOutlineClose } from 'react-icons/ai';

import Styles from './sidebar_skeleton.module.scss';

function SidebarSkeleton({ children }) {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  const getWrapperStyles = () => {
    if (isSidebarVisible) return [Styles.sidebarWrapper, Styles.show].join(' ');

    return Styles.sidebarWrapper;
  };

  const onToggleSidebar = () => {
    setIsSidebarVisible(prev => !prev);
  };

  return (
    <section className={getWrapperStyles()}>
      <button
        type="button"
        onClick={onToggleSidebar}
        className={Styles.sidebarBtn}
      >
        {isSidebarVisible ? <AiOutlineClose /> : <AiOutlineSetting />}
      </button>
      {children}
    </section>
  );
}

SidebarSkeleton.propTypes = {
  children: element.isRequired,
};

export default SidebarSkeleton;
