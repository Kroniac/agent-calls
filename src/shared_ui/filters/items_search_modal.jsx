import React, { useState, useEffect, useRef } from 'react';

import { Modal, Input, Button, Checkbox } from 'antd';

function ItemsSearchModal({ items, onFilter, isVisible, onHide }) {
  const [filteredItems, setFilteredItems] = useState([]);
  const allItems = useRef(items);

  useEffect(() => {
    if (isVisible) {
      setFilteredItems(items);
      allItems.current = items;
    }
  }, [isVisible, items]);

  const textInputRef = useRef();

  const onChangeText = e => {
    setFilteredItems(getFilteredItems(e.target.value));
  };

  const getFilteredItems = query => {
    if (!query) return allItems.current;
    return allItems.current.filter(el =>
      el.title.toLowerCase().includes(query.toLowerCase()),
    );
  };

  const onSelectItem = item => {
    allItems.current = allItems.current.map(el =>
      item.id === el.id ? { ...el, isSelected: !el.isSelected } : el,
    );

    setFilteredItems(getFilteredItems(textInputRef.current.state.value));
  };

  const onFilterHandler = () => {
    onFilter(allItems.current, filteredItems);
    onHide();
  };

  return (
    <Modal
      title={
        <div style={{ maxWidth: 200 }}>
          <Input
            ref={textInputRef}
            placeholder="Search Agents"
            onChange={onChangeText}
          />
        </div>
      }
      visible={isVisible}
      onOk={onFilterHandler}
      onCancel={() => {}}
      bodyStyle={{ padding: 12 }}
      onClose={onHide}
      closeIcon={<Button onClick={onHide}>X</Button>}
    >
      <div
        style={{
          height: 200,
          overflow: 'scroll',
          flexDirection: 'column',
          display: 'flex',
          flexWrap: 'wrap',
          padding: '0 5px',
          flex: 1,
        }}
      >
        {filteredItems.map(el => (
          <div>
            <Checkbox checked={el.isSelected} onChange={() => onSelectItem(el)}>
              {el.title}
            </Checkbox>
          </div>
        ))}
      </div>
    </Modal>
  );
}

export default ItemsSearchModal;
