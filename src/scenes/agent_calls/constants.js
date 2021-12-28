export const AGENT_CALLS_SORT_BY = {
  AGENTS_A_Z: 'Agents a-z',
  AGENTS_Z_A: 'Agents z-a',
  CALL_TIME_LOW_TO_HIGH: 'Call Time - Low to High',
  CALL_TIME_HIGH_TO_LOW: 'Call Time - High to Low',
};

export const AGENT_CALLS_SORT_BYS = Object.entries(AGENT_CALLS_SORT_BY).map(
  entry => entry[1],
);
