import React, { useRef, useEffect, useState } from 'react';

import { Slider } from 'antd';
import QueryString from 'query-string';
import { useLocation } from 'react-router-dom';

import { ItemsSearchSchema } from 'src/schemas/filters';
import ItemsSearch from 'src/shared_ui/filters/items_search';
import SidebarSkeleton from 'src/shared_ui/layout/sidebar_skeleton';

import Styles from '../home.module.scss';

function FilterView({ agents, durationRange, onFilter }) {
  const [agentItems, setAgentItems] = useState([]);
  const filters = useRef({});
  const location = useLocation();
  const sliderRef = useRef({});

  const minRange = durationRange?.minimum || 0;
  const maxRange = durationRange?.maximum || 0;

  useEffect(() => {
    filters.current = QueryString.parse(location.search);
    setAgentItems(getUpdatedItemsFromQueryParams());
    sliderRef.current.state.bounds = getDurationFromParams(filters.current);
  }, [agents, durationRange]);

  const onCallDurationChange = duration => {
    filters.current = {
      ...filters.current,
      filter_time_range: duration,
    };
    onFilter(filters.current);
  };

  const getDurationFromParams = params => {
    if (!(params?.filter_time_range && params.filter_time_range.length)) {
      return [minRange, maxRange];
    }

    return params.filter_time_range;
  };

  const onAgentsFilter = (agents, isUpdated) => {
    filters.current = {
      ...filters.current,
      filter_agent_list: agents.map(el => el.id),
    };

    onFilter(filters.current);
  };

  const getUpdatedItemsFromQueryParams = () => {
    const params = QueryString.parse(location.search);
    const items = agents.map(el => ItemsSearchSchema(el, el, el));
    if (!(params?.filter_agent_list && params.filter_agent_list.length))
      return items;
    const selectedAgentsMap = {};
    const filterAgentList = Array.isArray(params.filter_agent_list)
      ? params.filter_agent_list
      : [params.filter_agent_list];
    filterAgentList.forEach(param => {
      selectedAgentsMap[param] = params;
    });

    return items.map(item =>
      item.id in selectedAgentsMap ? { ...item, isSelected: true } : item,
    );
  };

  return (
    <SidebarSkeleton>
      <h4>Call Duration</h4>
      <Slider
        ref={sliderRef}
        onAfterChange={onCallDurationChange}
        min={minRange}
        max={maxRange}
        defaultValue={[minRange, maxRange]}
        range
        marks={{
          [minRange]: minRange,
          [maxRange]: maxRange,
        }}
      />
      <br />
      <ItemsSearch
        title="Agents"
        inputPlaceholder="Search Agents"
        items={agentItems}
        onFilter={onAgentsFilter}
      />
    </SidebarSkeleton>
  );
}

export default FilterView;
