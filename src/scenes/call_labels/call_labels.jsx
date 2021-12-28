import React, { useState, useRef, useEffect, useContext } from 'react';

import { Button, message, Spin, Result } from 'antd';

import { AppContext } from 'src/libs/context_api';
import { GetStatusCode } from 'src/libs/networking';
import {
  FetchCallLabels,
  FetchCalls,
  UpdateCallsLabelsReq,
} from 'src/server_reqs/agent_calls';

import Styles from './call_labels.module.scss';
import Calls from './components/calls';
import ManageLabels from './components/manage_labels';

function CallLabels() {
  const [calls, setCalls] = useState([]);
  const [selectedCallsById, setSelectedCallsById] = useState({});
  const [loadingState, setLoadingState] = useState({ state: 0, data: null });
  const initialSetup = useRef();

  const appContext = useContext(AppContext);

  useEffect(() => {
    document.title = 'Call Labels';
    initialSetup.current();
  }, []);

  initialSetup.current = async () => {
    setLoadingState({ state: 0, data: null });
    const config = await getCallLabelsConfig().catch(() => {});
    if (!config) return;
    onFetchCalls()
      .then(() => {})
      .catch(() => {});
  };

  const getCallLabelsConfig = () =>
    new Promise((resolve, reject) => {
      if (appContext.callLabelsConfig.labels) {
        resolve(appContext.callLabelsConfig);
        return;
      }

      FetchCallLabels()
        .then(res => {
          const config = {
            labels: res.data.data.unique_label_list,
          };
          appContext.updateCallLabelsConfig(config);
          resolve(config);
        })
        .catch(err => {
          setLoadingState({ state: 2, err });
          reject(err);
        });
    });

  const onFetchCalls = () =>
    new Promise((resolve, reject) => {
      setLoadingState({ state: 0, data: null });
      FetchCalls()
        .then(res => {
          setCalls(res.data.data.call_data);
          setLoadingState({ state: 2, data: null });
          resolve();
        })
        .catch(err => {
          setLoadingState({ state: 1, data: err });
          reject();
        });
    });

  const onSelectCall = call => {
    setSelectedCallsById(prev => {
      const selectedCallsCopy = { ...prev };
      if (call.call_id in selectedCallsCopy) {
        delete selectedCallsCopy[call.call_id];
      } else {
        selectedCallsCopy[call.call_id] = call;
      }

      return selectedCallsCopy;
    });
  };

  const onSelectAll = () => {
    const callsById = {};
    calls.forEach(call => {
      callsById[call.call_id] = call;
    });

    setSelectedCallsById(callsById);
  };

  const onUnSelectAll = () => {
    setSelectedCallsById({});
  };

  const onApplyLabels = labels => {
    if (!labels.length) {
      message.error('Please Enter Labels To Apply');
      return;
    }
    if (!getSelectedCallsCount(selectedCallsById)) {
      message.error('Please Select Call(s) To Apply Labels');
      return;
    }

    const submitObj = getSubmitObj(selectedCallsById, labels);
    onUpdateCallLabels(submitObj);
  };

  const getSubmitObj = (callsById, labels) => {
    const callList = Object.keys(callsById).map(id => Number(id));
    const labelOps = labels.map(label => ({
      name: label.name,
      op: label.op,
    }));

    return {
      operation: {
        callList,
        label_ops: labelOps,
      },
    };
  };

  const onUpdateCallLabels = async submitObj => {
    setLoadingState({ state: 0, data: null });
    const labelApplied = await UpdateCallsLabelsReq(submitObj)
      .then(
        () => Promise.resolve(true), // sync calls
      )
      .catch(err => {
        message.error(`Unable To Apply Labels ${GetStatusCode(err)}`);
        setLoadingState({ state: 2, data: null });
      });

    if (!labelApplied) return;

    const callSynced = await onFetchCalls()
      .then(() => Promise.resolve(true))
      .catch(() => {});

    if (callSynced) message.success('Labels Applied');
    else
      message.success(
        'Labels Applied But Calls Outdated. Please Refresh Calls',
      );
  };

  const getSelectedCallsCount = React.useCallback(
    () => Object.keys(selectedCallsById).length,
    [selectedCallsById],
  );

  const isAllCallsSelected = getSelectedCallsCount() === calls.length;

  if (loadingState.state === 1) {
    return (
      <div className={Styles.errWrapper}>
        <Result
          status="500"
          title={`Error ${GetStatusCode(loadingState.data)}`}
          subTitle="Unable to get latest calls"
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
        <ManageLabels
          options={appContext.callLabelsConfig?.labels || []}
          onApplyLabels={onApplyLabels}
        />
        <section className={Styles.callsWrapper}>
          <div className={Styles.headerBar}>
            <h4>Selected Calls:</h4>
            <h4 style={{ marginLeft: 5 }}>{`${getSelectedCallsCount()} / ${
              calls.length
            }`}</h4>
            <Button
              style={{ marginLeft: 10 }}
              onClick={!isAllCallsSelected ? onSelectAll : onUnSelectAll}
              size="small"
            >
              {!isAllCallsSelected ? 'Select All' : 'Unselect All'}
            </Button>
          </div>
          <Calls
            calls={calls}
            selectedCallsById={selectedCallsById}
            onSelectCall={onSelectCall}
          />
        </section>
      </div>
    </Spin>
  );
}

export default CallLabels;
