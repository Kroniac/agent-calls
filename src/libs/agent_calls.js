import { ItemsSearchSchema } from 'src/schemas/filters';

export const GetAgentsFromQueryParams = (params, agents) => {
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

export const GetDurationFromParams = (params, defaultRange) => {
  if (
    !(params?.filter_time_range && params.filter_time_range.length) ||
    !Array.isArray(params.filter_time_range)
  ) {
    return defaultRange;
  }

  return params.filter_time_range;
};

export function GetFiltersFromParams(params) {
  if (
    params.filter_agent_list &&
    params.filter_time_range &&
    Array.isArray(params.filter_time_range)
  ) {
    if (Array.isArray(params.filter_agent_list)) return params;
    if (params.filter_agent_list.length) {
      return {
        ...params,
        filter_agent_list: [params.filter_agent_list], // single item is parsed as a string
      };
    }
  }

  return null;
}

export const GetDefaultFiltersFromConfig = config => {
  const { maximum, minimum } = config.durationRange;
  const manualQParams = {
    filter_agent_list: config.agents.slice(0, 2),
    filter_time_range: [
      config.durationRange.minimum,
      Math.random() * (maximum - minimum + 1) + (minimum + 1),
    ],
  };

  return manualQParams;
};
