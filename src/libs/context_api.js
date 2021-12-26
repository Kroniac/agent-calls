import React, { useState } from 'react';

import { element } from 'prop-types';

export const AppContext = React.createContext();
export function Provider({ children }) {
  const [agentCallsConfig, setAgentCallsConfig] = useState({});

  const updateAgentCallsConfig = config => {
    setAgentCallsConfig(config);
  };

  return (
    <AppContext.Provider
      value={{
        agentCallsConfig,
        updateAgentCallsConfig,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

Provider.propTypes = {
  children: element.isRequired,
};
