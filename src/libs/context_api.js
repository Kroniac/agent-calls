import React, { useState } from 'react';

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

  return (
    <AppContext.Provider
      value={{
        agentCallsConfig,
        callLabelsConfig,
        updateAgentCallsConfig,
        updateCallLabelsConfig,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

Provider.propTypes = {
  children: element.isRequired,
};
