// http config
export default function httpConfig(timeout, headersItem, responseType) {
  let defaultTimeout = 30 * 1000;
  let defaultHeaders = {
    'Content-Type': 'application/json;charset=UTF-8',
    'token': window.sessionStorage.usrToken || ''
  }
  let defaultResType = 'json';
  if (headersItem) {
    defaultHeaders = Object.assign({}, defaultHeaders, headersItem)
  }
  console.log("timeout", timeout)
  console.log("headersItem", headersItem)
  console.log("responseType", responseType)
  return {
    timeout: timeout || defaultTimeout,
    headers: defaultHeaders,
    responseType: responseType || defaultResType
  }
}
