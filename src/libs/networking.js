import Axios from 'axios';

const ResponseErr = res => {
  if (!res?.data?.status_code) return false;
  const statusCode = res.data.status_code;
  return !(statusCode === 200 || statusCode === 201);
};

class ResServerError extends Error {
  constructor(status = null, message = '') {
    super();
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ResServerError);
    }

    this.status = status;
    this.message = message;
    this.response = {
      status,
      message,
      data: {
        non_field_errors: status === 400 ? [message] : [],
      },
    };
  }
}

function GetStatusCodeFromRes(res) {
  if (!res?.data?.status_code) return null;

  return res.data.status_code;
}

function GetMsgFromRes(res) {
  if (!res?.data?.message) return null;

  return res.data.message;
}

export function GetStatusCode(err) {
  if (err.response) return err.response.status;
  return null;
}

export const IsNonFieldError = err =>
  err &&
  err.response &&
  err.response.status === 400 &&
  (err.response.data?.non_field_errors || []).length > 0;

export const IsTimeoutErr = err => err?.code === 'ECONNABORTED';

export const Wraxios = reqConfig =>
  new Promise((resolve, reject) => {
    Axios(reqConfig)
      .then(res => {
        if (ResponseErr(res))
          throw new ResServerError(
            GetStatusCodeFromRes(res),
            GetMsgFromRes(res),
            res,
            reqConfig,
          );

        resolve(res);
      })
      .catch(err => {
        reject(err);
      });
  });
