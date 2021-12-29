import React from 'react';

import { Redirect, Route, Switch, withRouter } from 'react-router-dom';

import AgentCalls from 'src/scenes/agent_calls/agent_calls';

import CallLabels from './scenes/call_labels/call_labels';

function Routes() {
  return (
    <Switch>
      <Route path="/call_labels" component={CallLabels} />
      <Route path="/agent_calls" component={AgentCalls} />
      <Redirect to="/agent_calls" />
    </Switch>
  );
}

export default withRouter(Routes);
