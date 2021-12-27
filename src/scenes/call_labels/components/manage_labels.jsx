import React, { useState, useRef, useEffect } from 'react';

import { Button, Tag } from 'antd';
import { AiOutlineSetting } from 'react-icons/ai';
import { v4 as uuidv4 } from 'uuid';

import COLORS from 'src/config/colors';
import AddRemoveAutocomplete from 'src/shared_ui/input/add_remove_autocomplete';
import SidebarSkeleton from 'src/shared_ui/layout/sidebar_skeleton';

import Styles from '../call_labels.module.scss';

const SelectedLabelsSchema = (value, operation, uuid = uuidv4()) => ({
  name: value,
  op: operation,
  uuid,
});

const SELECT_OPERATION = {
  ADD: 'add',
  REMOVE: 'remove',
};

function ManageLabels({ options, onApplyLabels }) {
  const [selectedLabels, setSelectedLabels] = useState([]);
  const [filteredLabels, setFilteredLabels] = useState(options);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false); // only for small screens;
  const allLabels = useRef(options);

  useEffect(() => {
    allLabels.current = options;
    console.log(options);
    setFilteredLabels(getFilteredItems(''));
  }, [options]);

  const onSelectLabel = (item, operation) => {
    setSelectedLabels(prev => [...prev, SelectedLabelsSchema(item, operation)]);
  };

  const onCloseLabel = item => {
    setSelectedLabels(prev => prev.filter(el => el.uuid !== item.uuid));
  };

  const getFilteredItems = query => {
    if (!query) return allLabels.current;

    return [
      query,
      ...allLabels.current.filter(
        el => el.toLowerCase().includes(query.toLowerCase()) && query !== el,
      ),
    ];
  };

  const onChangeSearchText = query => {
    const labels = getFilteredItems(query);

    setFilteredLabels(labels);
  };

  const onClear = () => {
    setSelectedLabels([]);
  };

  return (
    <SidebarSkeleton>
      <h4>Manage Labels</h4>
      <AddRemoveAutocomplete
        options={filteredLabels}
        onChange={onChangeSearchText}
        onSelectItem={onSelectLabel}
        placeholder="Search Labels"
      />
      <div style={{ display: 'flex', marginTop: 12 }}>
        <Button onClick={onClear} size="small" style={{ marginRight: 5 }}>
          Clear
        </Button>
        <Button onClick={() => onApplyLabels(selectedLabels)} size="small">
          Apply Labels
        </Button>
      </div>
      <div style={{ marginTop: 12 }}>
        {selectedLabels.map(label => (
          <Tag
            key={label.uuid}
            color={
              SELECT_OPERATION.ADD === label.op ? COLORS.GREEN : COLORS.RED
            }
            closable
            onClose={() => onCloseLabel(label)}
            style={{ margin: 3, padding: '3px 5px' }}
          >
            {label.name}
          </Tag>
        ))}
      </div>
    </SidebarSkeleton>
  );
}

export default ManageLabels;
