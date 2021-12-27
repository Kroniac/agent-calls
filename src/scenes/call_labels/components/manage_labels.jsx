import React, { useState, useRef } from 'react';

import { Button, Tag } from 'antd';
import { v4 as uuidv4 } from 'uuid';

import COLORS from 'src/config/colors';
import AddRemoveAutocomplete from 'src/shared_ui/input/add_remove_autocomplete';

import Styles from '../call_labels.module.scss';

const options = [
  'abe',
  'andes',
  'arabian',
  'arctic',
  'atacama',
  'atlantic',
  'australia',
  'canada',
  'caspian',
  'cuba',
  'denmark',
  'egypt',
  'engineering',
  'everest',
  'geography',
  'germany',
  'graduation',
  'ham',
  'himalaya',
  'hongkong',
  'indian',
  'japan',
  'kenya',
  'london',
  'maths',
  'modi',
  'mountain',
  'newyork',
  'norway',
  'obama',
  'pacific',
  'peninsula',
  'phd',
  'plain',
  'plateau',
  'politics',
  'randm',
  'red',
  'rocky',
  'russia',
  'sahara',
  'science',
  'spam',
  'switzerland',
  'syberia',
  'sydney',
  'thar',
  'trump',
  'unnown',
  'unread',
  'usa',
  'vietnam',
];

const SelectedLabelsSchema = (value, operation, uuid = uuidv4()) => ({
  name: value,
  op: operation,
  uuid,
});

const SELECT_OPERATION = {
  ADD: 'add',
  REMOVE: 'remove',
};

function ManageLabels({ onApplyLabels }) {
  const [selectedLabels, setSelectedLabels] = useState([]);
  const [filteredLabels, setFilteredLabels] = useState(options);
  const allLabels = useRef(options);

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
    <section className={Styles.manageLabelWrapper}>
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
    </section>
  );
}

export default ManageLabels;
