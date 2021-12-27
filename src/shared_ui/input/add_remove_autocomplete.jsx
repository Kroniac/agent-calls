import React, { useRef } from 'react';

import { AutoComplete, Button } from 'antd';
import { arrayOf, string, func } from 'prop-types';

import COLORS from 'src/config/colors';
const { Option } = AutoComplete;

const SELECT_OPERATION = {
  ADD: 'add',
  REMOVE: 'remove',
};

function AddRemoveAutocomplete({
  options,
  onChange,
  onSelectItem,
  placeholder,
}) {
  const autocompleteRef = useRef();

  const onAdd = (e, item) => {
    e.stopPropagation();
    autocompleteRef.current.blur();
    onSelectItem(item, SELECT_OPERATION.ADD);
  };

  const onRemove = (e, item) => {
    e.stopPropagation();
    autocompleteRef.current.blur();
    onSelectItem(item, SELECT_OPERATION.REMOVE);
  };

  return (
    <AutoComplete
      ref={autocompleteRef}
      style={{ width: 200 }}
      onSelect={item => onSelectItem(item, SELECT_OPERATION.ADD)}
      placeholder={placeholder}
      onChange={onChange}
    >
      {options.map(label => (
        <Option key={label} value={label}>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
            }}
          >
            <div>{label}</div>
            <div>
              <Button
                size="small"
                style={{
                  width: 25,
                  marginRight: 4,
                  color: COLORS.GREEN,
                  borderColor: COLORS.GREEN,
                  fontWeight: 'bold',
                }}
                color={COLORS.GREEN}
                onClick={e => onAdd(e, label)}
              >
                +
              </Button>
              <Button
                size="small"
                style={{
                  width: 25,
                  color: COLORS.RED,
                  borderColor: COLORS.RED,
                  fontWeight: 'bold',
                }}
                onClick={e => onRemove(e, label)}
              >
                -
              </Button>
            </div>
          </div>
        </Option>
      ))}
    </AutoComplete>
  );
}

AddRemoveAutocomplete.propTypes = {
  options: arrayOf(string).isRequired,
  onChange: func.isRequired,
  onSelectItem: func.isRequired,
  placeholder: string,
};

AddRemoveAutocomplete.defaultProps = {
  placeholder: 'enter here',
};

export default AddRemoveAutocomplete;
