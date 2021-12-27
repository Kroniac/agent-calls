import React from 'react';

import { Redirect, Route, Switch, withRouter } from 'react-router-dom';

import Home from 'src/scenes/home/home';

import CallLabels from './scenes/call_labels/call_labels';

function Routes() {
  return (
    <Switch>
      <Route path="/call_labels" component={CallLabels} />
      <Route path="/home" component={Home} />
      <Redirect to="/call_labels" />
    </Switch>
  );
}

export default withRouter(Routes);
