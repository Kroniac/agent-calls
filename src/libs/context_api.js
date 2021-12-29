import React, { useMemo, useState } from 'react';

import { element } from 'prop-types';

export const AppContext = React.createContext();
export function Provider({ children }) {
  const [agentCallsConfig, setAgentCallsConfig] = useState({});
  const [callLabelsConfig, setCallLabelsConfig] = useState({});

  const updateAgentCallsConfig = config => {
    setAgentCallsConfig(config);
  };

  const updateCallLabelsConfig = config => {
    setCallLabelsConfig(config);
  };

  const contextValues = useMemo(
    () => ({
      agentCallsConfig,
      callLabelsConfig,
      updateAgentCallsConfig,
      updateCallLabelsConfig,
    }),
    [agentCallsConfig, callLabelsConfig],
  );

  return (
    <AppContext.Provider value={contextValues}>{children}</AppContext.Provider>
  );
}

Provider.propTypes = {
  children: element.isRequired,
};
