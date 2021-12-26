import Axios from 'axios';

import ApiUrls from 'src/config/api_urls';

Axios.defaults.baseURL = 'https://damp-garden-93707.herokuapp.com/';

export const FetchAgents = () =>
  new Promise((resolve, reject) => {
    Axios({
      url: ApiUrls.agents,
    })
      .then(resolve)
      .catch(reject);
  });

export const FetchDurationRanges = () =>
  new Promise((resolve, reject) => {
    Axios({
      url: ApiUrls.durationRange,
    })
      .then(resolve)
      .catch(reject);
  });

export const FetchAgentCalls = filters =>
  new Promise((resolve, reject) => {
    Axios({
      url: ApiUrls.filteredCalls,
      method: 'POST',
      data: {
        info: filters,
      },
    })
      .then(resolve)
      .catch(reject);
  });
