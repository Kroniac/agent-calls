import React from 'react';

import { List, Card } from 'antd';

import Styles from '../home.module.scss';

function Calls({ calls }) {
  return (
    <List
      size="small"
      pagination={{
        showSizeChanger: true,
        defaultPageSize: 15,
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
          key={item.id}
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

export default Calls;
