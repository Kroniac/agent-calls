import React, { useState, useEffect, useRef } from 'react';

import { Modal, Input, Button, Checkbox } from 'antd';
import {
  arrayOf,
  oneOfType,
  shape,
  string,
  number,
  bool,
  array,
  object,
  func,
} from 'prop-types';

function ItemsSearchModal({
  items,
  onFilter,
  isVisible,
  onHide,
  onClearAll,
  inputPlaceholder,
}) {
  const [filteredItems, setFilteredItems] = useState([]);
  const allItems = useRef(items);
  const textInputRef = useRef();

  useEffect(() => {
    if (isVisible) {
      textInputRef.current.state.value = '';
      textInputRef.current.focus();
      setFilteredItems(items);
      allItems.current = items;
    }

    return () => {};
  }, [isVisible, items]);

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

  const onClearAllHandler = () => {
    onClearAll();
    onHide();
  };

  const onCloseHandler = e => {
    e.preventDefault();
    e.stopPropagation();
    onHide();
  };

  return (
    <Modal
      title={
        <div style={{ maxWidth: 200 }}>
          <Input
            ref={textInputRef}
            placeholder={inputPlaceholder}
            onChange={onChangeText}
          />
        </div>
      }
      visible={isVisible}
      onOk={onFilterHandler}
      onCancel={onClearAllHandler}
      bodyStyle={{ padding: 12 }}
      onClose={onCloseHandler}
      cancelText="Clear All"
      okText="Search"
      maskClosable={false}
      closeIcon={<Button onClick={onCloseHandler}>X</Button>}
    >
      <div
        style={{
          height: 200,
          overflowX: 'scroll',
          flexDirection: 'column',
          display: 'flex',
          flexWrap: 'wrap',
          padding: '0 5px',
          flex: 1,
        }}
      >
        {filteredItems.map(el => (
          <div key={el.id}>
            <Checkbox checked={el.isSelected} onChange={() => onSelectItem(el)}>
              {el.title}
            </Checkbox>
          </div>
        ))}
      </div>
    </Modal>
  );
}

ItemsSearchModal.propTypes = {
  items: arrayOf(
    shape({
      title: string.isRequired,
      id: oneOfType([number, string]).isRequired,
      isSelected: bool.isRequired,
      item: oneOfType([number, string, object, array]).isRequired,
    }),
  ).isRequired,
  onFilter: func.isRequired,
  isVisible: bool.isRequired,
  onHide: func.isRequired,
  onClearAll: func.isRequired,
  inputPlaceholder: string,
};

ItemsSearchModal.defaultProps = {
  inputPlaceholder: 'Search',
};

export default ItemsSearchModal;
