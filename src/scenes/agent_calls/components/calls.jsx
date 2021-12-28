import React from 'react';

import { List, Card } from 'antd';
import { arrayOf, number, shape } from 'prop-types';
import { FiPhoneCall } from 'react-icons/fi';

import Styles from '../agent_calls.module.scss';

function Calls({ calls }) {
  const formatCallTime = callTime => {
    const cleanedCallTime = callTime.toFixed(2);
    const hrs = Math.floor(cleanedCallTime / 60);
    const mins = Math.floor(cleanedCallTime) % 60;
    const secs = Math.floor(
      (cleanedCallTime - Math.floor(cleanedCallTime)) * 100,
    );

    const formattedTime = [];

    if (hrs) formattedTime.push(`${hrs} ${hrs === 1 ? 'hr' : 'hrs'}`);
    if (mins) formattedTime.push(`${mins} ${mins === 1 ? 'min' : 'mins'}`);
    if (secs) formattedTime.push(`${secs} ${secs === 1 ? 'sec' : 'secs'}`);

    return formattedTime.join(' ') || '0 sec';
  };

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
            <div className={Styles.callTime}>
              <FiPhoneCall style={{ marginRight: 7 }} />{' '}
              {formatCallTime(item.call_time)}
            </div>
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
