import React, { useState, useRef, useEffect } from 'react';

import { Input, Checkbox, Button } from 'antd';
import {
  arrayOf,
  oneOfType,
  string,
  bool,
  array,
  shape,
  number,
  object,
  func,
} from 'prop-types';
import QueryString from 'query-string';
import { useLocation } from 'react-router-dom';

import Styles from './filters.module.scss';
import ItemsSearchModal from './items_search_modal';

function ItemsSearch({ items, title, inputPlaceholder, onFilter }) {
  const [showSearchModal, setShowAgentsSearchModal] = useState(false);
  const [filteredItems, setFilteredItems] = useState([]);
  const allItems = useRef(items);

  const textInputRef = useRef();

  useEffect(() => {
    allItems.current = items;
    setFilteredItems(allItems.current);
  }, [items]);

  const onChangeAgentText = e => {
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
    onFilter(allItems.current.filter(el => el.isSelected), true);
  };

  const checkSelectedItemsChanged = (oldItems, updatedItems) => {
    const oldSelectedItems = oldItems.filter(el => el.isSelected);
    const updatedSelectedItems = updatedItems.filter(el => el.isSelected);

    if (oldSelectedItems.length !== updatedSelectedItems.length) return true;

    const oldItemsMap = {};
    oldSelectedItems.forEach(el => {
      oldItemsMap[el.id] = el;
    });
    let isChanged = false;
    updatedSelectedItems.forEach(el => {
      if (!(el.id in oldItemsMap)) isChanged = true;
    });

    return isChanged;
  };

  const onFilterHandler = updatedItems => {
    const oldAllItems = allItems.current;
    allItems.current = updatedItems;
    setFilteredItems(getFilteredItems(textInputRef.current.state.value));
    onFilter(
      updatedItems.filter(el => el.isSelected),
      checkSelectedItemsChanged(oldAllItems, allItems.current),
    );
  };

  const onShowMoreAgents = () => {
    setShowAgentsSearchModal(true);
  };

  const onHideSearchModal = () => {
    setShowAgentsSearchModal(false);
  };

  const onClearAll = () => {
    const oldAllItems = allItems.current;
    allItems.current = allItems.current.map(el => ({
      ...el,
      isSelected: false,
    }));
    setFilteredItems(getFilteredItems(textInputRef.current.state.value));
    onFilter(
      allItems.current.filter(el => el.isSelected),
      checkSelectedItemsChanged(oldAllItems, allItems.current),
    );
  };

  return (
    <div className={Styles.itemsSearch}>
      <h4>{title}</h4>
      <Input
        ref={textInputRef}
        placeholder={inputPlaceholder}
        onChange={onChangeAgentText}
      />
      <div className={Styles.itemsWrapper}>
        {filteredItems.slice(0, 5).map(el => (
          <div key={el.id}>
            <Checkbox checked={el.isSelected} onChange={() => onSelectItem(el)}>
              {el.title}
            </Checkbox>
          </div>
        ))}
      </div>
      <Button
        style={{ textAlign: 'left', paddingLeft: 2 }}
        size="small"
        type="link"
        block
        onClick={onShowMoreAgents}
      >
        Some More
      </Button>
      <ItemsSearchModal
        isVisible={showSearchModal}
        items={allItems.current}
        onFilter={onFilterHandler}
        onHide={onHideSearchModal}
        onClearAll={onClearAll}
      />
    </div>
  );
}

ItemsSearch.propTypes = {
  items: arrayOf(
    shape({
      title: string.isRequired,
      id: oneOfType([number, string]).isRequired,
      isSelected: bool.isRequired,
      item: oneOfType([number, string, object, array]).isRequired,
    }),
  ).isRequired,
  title: string,
  inputPlaceholder: string,
  onFilter: func.isRequired,
};

ItemsSearch.defaultProps = {
  title: '',
  inputPlaceholder: 'Search',
};

export default ItemsSearch;
