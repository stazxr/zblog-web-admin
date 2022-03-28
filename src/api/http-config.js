// http config
export default function httpConfig(timeout, headersItem) {
  let defaultTimeout = 30 * 1000;
  let defaultHeaders = {
    'Content-Type': 'application/json;charset=UTF-8',
    'token': window.sessionStorage.usrToken
  }
  if (headersItem) {
    defaultHeaders = Object.assign({}, defaultHeaders, headersItem)
  }
  return {
    timeout: timeout || defaultTimeout,
    headers: defaultHeaders
  }
}
