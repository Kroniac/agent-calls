import ApiUrls from 'src/config/api_urls';
import { Wraxios } from 'src/libs/networking';

export const UpdateCallsLabelsReq = submitObj =>
  new Promise((resolve, reject) => {
    Wraxios({
      url: ApiUrls.applyLabels,
      method: 'POST',
      data: submitObj,
      headers: {
        user_id: '24b456',
      },
    })
      .then(resolve)
      .catch(reject);
  });

export const FetchCallLabels = () =>
  new Promise((resolve, reject) => {
    Wraxios({
      url: ApiUrls.labels,
      headers: {
        user_id: '24b456',
      },
    })
      .then(resolve)
      .catch(reject);
  });

export const FetchCalls = () =>
  new Promise((resolve, reject) => {
    Wraxios({
      url: ApiUrls.calls,
      headers: {
        user_id: '24b456',
      },
    })
      .then(resolve)
      .catch(reject);
  });
