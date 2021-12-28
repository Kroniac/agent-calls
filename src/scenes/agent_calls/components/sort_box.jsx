import React from 'react';

import { Radio } from 'antd';
import { string, func } from 'prop-types';

import Styles from '../agent_calls.module.scss';
import { AGENT_CALLS_SORT_BYS } from '../constants';

function SortBox({ selectedItem, onSort }) {
  const onChange = e => {
    onSort(e.target.value);
  };

  return (
    <div className={Styles.sortBox}>
      <h4>Sort By</h4>
      <Radio.Group size="small" value={selectedItem} onChange={onChange}>
        {AGENT_CALLS_SORT_BYS.map(item => (
          <Radio.Button key={item} size="small" value={item}>
            {item}
          </Radio.Button>
        ))}
      </Radio.Group>
    </div>
  );
}

SortBox.propTypes = {
  selectedItem: string.isRequired,
  onSort: func.isRequired,
};

export default SortBox;
