import React, { useState, useEffect, useContext, useRef } from 'react';

import { Spin, Result, Button } from 'antd';
import QueryString from 'query-string';
import { useHistory, useLocation } from 'react-router-dom';

import {
  GetDefaultFiltersFromConfig,
  GetFiltersFromParams,
} from 'src/libs/agent_calls';
import { AppContext } from 'src/libs/context_api';
import { GetStatusCode } from 'src/libs/networking';
import {
  FetchAgentCalls,
  FetchAgents,
  FetchDurationRanges,
} from 'src/server_reqs/agent_calls';

import Styles from './agent_calls.module.scss';
import Calls from './components/calls';
import FilterView from './components/filter_view';
import SortBox from './components/sort_box';
import { AGENT_CALLS_SORT_BY } from './constants';

function AgentCalls() {
  const [agentCalls, setAgentCalls] = useState([]);
  const [currSortBy, setCurrSortBy] = useState('');
  const [loadingState, setLoadingState] = useState({ state: 0, data: null });
  const [manualParams, setManualParams] = useState({});

  const history = useHistory();
  const location = useLocation();

  const initialSetup = useRef();
  const appContext = useContext(AppContext);

  useEffect(() => {
    document.title = 'Agent Calls';
    initialSetup.current();
  }, []);

  initialSetup.current = async () => {
    setLoadingState({ state: 0, data: null });
    const config = await getAgentCallsConfig().catch(() => {});
    if (!config) return;
    const params = getInitialQueryParams(config);
    if (params.sortBy) setCurrSortBy(params.sortBy);
    onFetchAgentCalls(params, params.sortBy);
  };

  const getAgentCallsConfig = () =>
    new Promise((resolve, reject) => {
      if (
        appContext.agentCallsConfig.agents &&
        appContext.agentCallsConfig.durationRange
      ) {
        resolve(appContext.agentCallsConfig);
        return;
      }

      Promise.all([FetchAgents(), FetchDurationRanges()])
        .then(res => {
          const config = {
            agents: res[0].data.data.listofagents,
            durationRange: {
              minimum: Math.floor(res[1].data.data.minimum),
              maximum: Math.ceil(res[1].data.data.maximum),
            },
          };
          appContext.updateAgentCallsConfig(config);
          resolve(config);
        })
        .catch(err => {
          setLoadingState({ state: 2, data: err });
          reject(err);
        });
    });

  const getInitialQueryParams = config => {
    const params = QueryString.parse(location.search);

    const filtersFromParams = GetFiltersFromParams(params);
    if (filtersFromParams) return filtersFromParams;

    const defaultParams = GetDefaultFiltersFromConfig(config);
    setManualParams(defaultParams);
    return defaultParams;
  };

  const getSortFn = sortBy => {
    switch (sortBy) {
      case AGENT_CALLS_SORT_BY.AGENTS_A_Z:
        return (a, b) => a.agent_id.localeCompare(b.agent_id);
      case AGENT_CALLS_SORT_BY.AGENTS_Z_A:
        return (a, b) => b.agent_id.localeCompare(a.agent_id);
      case AGENT_CALLS_SORT_BY.CALL_TIME_LOW_TO_HIGH:
        return (a, b) => a.call_time - b.call_time;
      case AGENT_CALLS_SORT_BY.CALL_TIME_HIGH_TO_LOW:
        return (a, b) => b.call_time - a.call_time;
      default:
        return null;
    }
  };

  const onSortHandler = sortBy => {
    if (currSortBy === sortBy) return;
    const params = QueryString.parse(location.search);
    history.push({
      pathname: '/agent_calls',
      search: QueryString.stringify({
        ...params,
        sortBy,
      }),
    });
    setCurrSortBy(sortBy);
    const sortFn = getSortFn(sortBy);
    if (!sortFn) return;
    setAgentCalls(prev => {
      const agentCallsCopy = [...prev];
      agentCallsCopy.sort(sortFn);
      return agentCallsCopy;
    });
  };

  const getSanitizedAgentCallsFilters = params => ({
    filter_agent_list: params.filter_agent_list,
    filter_time_range: params.filter_time_range.map(time => parseFloat(time)),
  });

  const onFetchAgentCalls = (params, sortBy = currSortBy) => {
    setLoadingState({ state: 0, data: null });
    history.push({
      pathname: '/agent_calls',
      search: QueryString.stringify(params),
    });

    FetchAgentCalls(getSanitizedAgentCallsFilters(params))
      .then(res => {
        const sortFn = getSortFn(sortBy);
        if (!sortFn) setAgentCalls(res.data.data);
        else {
          const sortedCalls = [...res.data.data].sort(sortFn);
          setAgentCalls(sortedCalls);
        }
        setLoadingState({ state: 2, data: null });
      })
      .catch(err => {
        setLoadingState({ state: 1, data: err });
      });
  };

  if (loadingState.state === 1) {
    return (
      <div className={Styles.errWrapper}>
        <Result
          status="500"
          title={`Error ${GetStatusCode(loadingState.data)}`}
          extra={
            <Button onClick={initialSetup.current} size="large" type="primary">
              Retry
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <Spin tip="Loading..." spinning={loadingState.state === 0}>
      <div className={Styles.root}>
        <FilterView
          manualParams={manualParams}
          onFilter={onFetchAgentCalls}
          agents={appContext.agentCallsConfig?.agents || []}
          durationRange={appContext.agentCallsConfig?.durationRange || {}}
        />
        <section className={Styles.callsWrapper}>
          <SortBox selectedItem={currSortBy} onSort={onSortHandler} />
          <Calls calls={agentCalls} />
        </section>
      </div>
    </Spin>
  );
}

export default AgentCalls;
