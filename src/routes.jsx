import React from 'react';

import { Redirect, Route, Switch, withRouter } from 'react-router-dom';

import Home from 'src/scenes/home/home';

function Routes() {
  return (
    <Switch>
      <Route path="/home" component={Home} />
      <Redirect to="/home" />
    </Switch>
  );
}

export default withRouter(Routes);
