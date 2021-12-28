import React from 'react';

import { List, Card } from 'antd';
import { arrayOf, number, shape } from 'prop-types';

import Styles from '../agent_calls.module.scss';

function Calls({ calls }) {
  return (
    <List
      size="small"
      pagination={{
        showSizeChanger: true,
        defaultPageSize: 18,
      }}
      grid={{
        column: 3,
        md: 2,
        sm: 1,
        xs: 1,
        gutter: 5,
      }}
      dataSource={calls}
      renderItem={item => (
        <List.Item
          key={item.call_id}
          className={Styles.callItem}
          style={{ width: '100%', padding: 0, marginBottom: 5 }}
        >
          <Card size="small" title={item.agent_id}>
            <div>{item.call_time}</div>
          </Card>
        </List.Item>
      )}
    />
  );
}

Calls.propTypes = {
  calls: arrayOf(
    shape({
      call_id: number.isRequired,
      call_time: number.isRequired,
    }),
  ),
};

export default Calls;
