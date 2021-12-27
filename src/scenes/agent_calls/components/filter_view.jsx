import React, { useRef, useEffect, useState } from 'react';

import { Slider } from 'antd';
import {
  shape,
  number,
  string,
  arrayOf,
  func,
  objectOf,
  array,
} from 'prop-types';
import QueryString from 'query-string';
import { useLocation } from 'react-router-dom';

import {
  GetDurationFromParams,
  GetAgentsFromQueryParams,
} from 'src/libs/agent_calls';
import ItemsSearch from 'src/shared_ui/filters/items_search';
import SidebarSkeleton from 'src/shared_ui/layout/sidebar_skeleton';

function FilterView({ agents, durationRange, onFilter, manualParams }) {
  const [agentItems, setAgentItems] = useState([]);
  const filters = useRef({});
  const location = useLocation();
  const sliderRef = useRef({});

  const minRange = durationRange?.minimum || 0;
  const maxRange = durationRange?.maximum || 0;

  useEffect(() => {
    filters.current = QueryString.parse(location.search);
    setAgentItems(GetAgentsFromQueryParams(filters.current, agents));
    sliderRef.current.state.bounds = GetDurationFromParams(filters.current, [
      minRange,
      maxRange,
    ]);
  }, [agents, durationRange]);

  useEffect(() => {
    filters.current = manualParams;
    setAgentItems(GetAgentsFromQueryParams(manualParams, agents));
    sliderRef.current.state.bounds = GetDurationFromParams(manualParams, [
      minRange,
      maxRange,
    ]);
  }, [manualParams]);

  const onCallDurationChange = duration => {
    filters.current = {
      ...filters.current,
      filter_time_range: duration,
    };
    onFilter(filters.current);
  };

  const onAgentsFilter = filteredAgents => {
    filters.current = {
      ...filters.current,
      filter_agent_list: filteredAgents.map(el => el.id),
    };

    onFilter(filters.current);
  };

  return (
    <SidebarSkeleton>
      <>
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
      </>
    </SidebarSkeleton>
  );
}

FilterView.propTypes = {
  agents: arrayOf(string).isRequired,
  durationRange: shape({
    minimum: number,
    maximum: number,
  }),
  onFilter: func.isRequired,
  manualParams: objectOf(array).isRequired,
};

FilterView.defaultProps = {
  durationRange: null,
};

export default FilterView;
