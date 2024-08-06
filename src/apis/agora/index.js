import axios from "axios";

const APP_ID = import.meta.env.VITE_AGORA_RTC_APP_KEY;

// Agora Restful API 콘솔에서 발급받은 키
const customerKey = import.meta.env.VITE_AGORA_REST_API_CUSTOMER_ID;
const customerSecret = import.meta.env.VITE_AGORA_REST_API_CUSTOMER_SECRET;

/**
 * Agora REST API를 사용하기 위한 credential 생성
 * Agora API 호출할 때마다 헤더에 포함해야 합니다.
 */
const plainCredential = customerKey + ":" + customerSecret;

console.log(APP_ID, customerKey, customerSecret);

const encodedCredential = window.btoa(plainCredential);
const authorizationField = "Basic " + encodedCredential;
console.log(authorizationField);
const agoraClient = axios.create({
  baseURL: `https://api.agora.io/v1/apps/${APP_ID}`,
  // timeout: 3000,
});

agoraClient.interceptors.request.use(
  function (config) {
    console.log("[AGORA CLIENT INTERCEPTOR]");
    config.headers.Authorization = authorizationField;

    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export { agoraClient };
