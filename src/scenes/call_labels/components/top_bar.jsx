import React from 'react';

import { Button } from 'antd';
import { string, bool, func } from 'prop-types';

import Styles from '../call_labels.module.scss';

function TopBar({
  selectedCallsText,
  isAllCallsSelected,
  onSelectAll,
  onUnSelectAll,
}) {
  return (
    <div className={Styles.headerBar}>
      <h4>Selected Calls:</h4>
      <h4 style={{ marginLeft: 5 }}>{selectedCallsText}</h4>
      <Button
        style={{ marginLeft: 10 }}
        onClick={!isAllCallsSelected ? onSelectAll : onUnSelectAll}
        size="small"
      >
        {!isAllCallsSelected ? 'Select All' : 'Unselect All'}
      </Button>
    </div>
  );
}

TopBar.propTypes = {
  selectedCallsText: string.isRequired,
  isAllCallsSelected: bool.isRequired,
  onSelectAll: func.isRequired,
  onUnSelectAll: func.isRequired,
};

export default TopBar;
