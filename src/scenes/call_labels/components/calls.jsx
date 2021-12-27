import React from 'react';

import { List, Card, Tag } from 'antd';
import { ImCheckboxUnchecked, ImCheckboxChecked } from 'react-icons/im';

import COLORS from 'src/config/colors';

import Styles from '../call_labels.module.scss';

function Calls({ calls, selectedCallsById, onSelectCall }) {
  return (
    <List
      size="small"
      pagination={{
        showSizeChanger: true,
        defaultPageSize: 12,
      }}
      grid={{
        column: 4,
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
          <Card
            onClick={() => onSelectCall(item)}
            size="small"
            title={
              <div
                style={{
                  display: 'flex',
                  fontWeight: 'normal',
                  justifyContent: 'space-between',
                }}
              >
                {item.call_id}
                {item.call_id in selectedCallsById ? (
                  <ImCheckboxChecked color={COLORS.GREEN} />
                ) : (
                  <ImCheckboxUnchecked />
                )}
              </div>
            }
          >
            <div style={{ maxHeight: 100, overflowY: 'auto' }}>
              {item.label_id.map(el => (
                <Tag style={{ margin: '2px 4px 2px 0' }}>{el}</Tag>
              ))}
              {!item.label_id.length ? 'No Labels Linked' : ''}
            </div>
          </Card>
        </List.Item>
      )}
    />
  );
}

export default Calls;
