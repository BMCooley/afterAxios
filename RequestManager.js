// fake pr for testing github flow

import axios from 'axios'

let outstandingRequests = 0;
const promises = [];

export default class RequestManager {
  
  static onRequest = () => {
    outstandingRequests += 1;
  }
  static onResponse = () => {
    setTimeout(() => {
      if (--outstandingRequests <= 0) {
        while (promises.length) {
          promises.shift()('response reslove ' + outstandingRequests);
        }
      }
    }, 0)
  }
  static afterAll = () => {
    if (!outstandingRequests) {
      return Promise.resolve('insta resolve ' + outstandingRequests);
    } else {
      return new Promise((resolve) => promises.push(resolve));
    }
  }
}

axios.interceptors.request.use(function (config) {
  RequestManager.onRequest();
  return config;
}, function (error) {
  return Promise.reject(error);
});

axios.interceptors.response.use(function (response) {
  RequestManager.onResponse();
  return response;
}, function (error) {
  RequestManager.onResponse();
  return Promise.reject(error);
});
